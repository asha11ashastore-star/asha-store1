from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, desc
from typing import List, Optional
from app.database import get_db
from app.schemas import (
    OrderCreate, OrderResponse, OrderListResponse, PaginatedResponse, CustomerOrderCreate
)
from app.models import (
    Order, OrderItem, Product, CartItem, Address, User, UserRole, 
    OrderStatus, PaymentStatus
)
from app.auth import get_current_user, get_current_seller, get_current_admin
from app.config import settings
from decimal import Decimal
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/orders", tags=["Orders"])

def generate_order_number() -> str:
    """Generate unique order number"""
    return f"ORD-{uuid.uuid4().hex[:8].upper()}"

def calculate_order_totals(items: List[dict]) -> dict:
    """Calculate order totals"""
    subtotal = sum(item['quantity'] * item['unit_price'] for item in items)
    tax_amount = subtotal * Decimal('0.18')  # 18% GST
    shipping_amount = Decimal('50.00') if subtotal < 500 else Decimal('0.00')  # Free shipping above ₹500
    discount_amount = Decimal('0.00')  # Can be extended for coupon support
    total_amount = subtotal + tax_amount + shipping_amount - discount_amount
    
    return {
        'subtotal': subtotal,
        'tax_amount': tax_amount,
        'shipping_amount': shipping_amount,
        'discount_amount': discount_amount,
        'total_amount': total_amount
    }

@router.post("/customer", response_model=OrderResponse)
def create_customer_order(
    order_data: CustomerOrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order with customer address (for checkout)"""
    try:
        # Create address for this order
        address_data = order_data.shipping_address
        db_address = Address(
            user_id=current_user.id,
            title="Order Address",
            full_name=order_data.customer_name,
            phone=order_data.customer_phone,
            address_line_1=address_data.get("line1", ""),
            address_line_2=address_data.get("line2", ""),
            city=address_data.get("city", ""),
            state=address_data.get("state", ""),
            postal_code=address_data.get("pincode", ""),
            country=address_data.get("country", "India"),
            is_default=False
        )
        db.add(db_address)
        db.flush()  # Get the address ID
        
        # Create order with the new address ID
        order_create_data = OrderCreate(
            delivery_address_id=db_address.id,
            items=order_data.items,
            notes=order_data.notes
        )
        
        # Continue with normal order creation logic
        return create_order_internal(order_create_data, current_user, db)
        
    except Exception as e:
        logger.error(f"Customer order creation failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Order creation failed"
        )

def create_order_internal(
    order_data: OrderCreate,
    current_user: User,
    db: Session
) -> OrderResponse:
    """Internal order creation logic"""
    try:
        # Validate delivery address
        address = db.query(Address).filter(
            and_(Address.id == order_data.delivery_address_id, Address.user_id == current_user.id)
        ).first()
        if not address:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid delivery address"
            )
        
        # Validate and prepare order items
        order_items = []
        for item in order_data.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if not product or product.status != 'active':
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product {item.product_id} not found or inactive"
                )
            
            if product.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Insufficient stock for product {product.name}"
                )
            
            # Use discounted price if available
            unit_price = product.discounted_price or product.price
            total_price = unit_price * item.quantity
            
            # Calculate commission (platform fee)
            commission_amount = total_price * Decimal(str(settings.platform_commission_rate))
            seller_amount = total_price - commission_amount
            
            order_items.append({
                'product_id': product.id,
                'seller_id': product.seller_id,
                'quantity': item.quantity,
                'unit_price': unit_price,
                'total_price': total_price,
                'commission_amount': commission_amount,
                'seller_amount': seller_amount
            })
        
        # Calculate order totals
        totals = calculate_order_totals(order_items)
        
        # Create order
        db_order = Order(
            order_number=generate_order_number(),
            buyer_id=current_user.id,
            delivery_address_id=order_data.delivery_address_id,
            notes=order_data.notes,
            **totals
        )
        
        db.add(db_order)
        db.flush()  # Get order ID
        
        # Create order items
        for item_data in order_items:
            order_item = OrderItem(
                order_id=db_order.id,
                **item_data
            )
            db.add(order_item)
        
        db.commit()
        db.refresh(db_order)
        
        # Clear cart items for ordered products
        cart_product_ids = [item['product_id'] for item in order_items]
        db.query(CartItem).filter(
            and_(
                CartItem.user_id == current_user.id,
                CartItem.product_id.in_(cart_product_ids)
            )
        ).delete()
        db.commit()
        
        logger.info(f"Order created successfully: {db_order.order_number}")
        return db_order
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Order creation failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Order creation failed"
        )

@router.post("/", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order"""
    return create_order_internal(order_data, current_user, db)

@router.get("/seller", response_model=PaginatedResponse)
def get_seller_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[OrderStatus] = None,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Get orders for seller's products (only confirmed/paid orders)"""
    try:
        # Build query for orders containing seller's products
        # Only show confirmed orders (payment completed)
        query = db.query(Order).join(OrderItem).join(Product).options(
            joinedload(Order.delivery_address),
            joinedload(Order.buyer),
            joinedload(Order.order_items).joinedload(OrderItem.product).joinedload(Product.images),
            joinedload(Order.order_items).joinedload(OrderItem.product).joinedload(Product.seller)
        ).filter(
            and_(
                Product.seller_id == current_seller.id,
                Order.payment_status == PaymentStatus.COMPLETED,  # Only paid orders
                Order.status != OrderStatus.CANCELLED
            )
        ).distinct()

        # Apply status filter if provided
        if status_filter:
            query = query.filter(Order.status == status_filter)

        # Get total count
        total = query.count()

        # Apply pagination and ordering
        orders = query.order_by(desc(Order.created_at)).offset((page - 1) * limit).limit(limit).all()

        # Format response
        order_responses = []
        for order in orders:
            order_responses.append({
                'id': order.id,
                'order_number': order.order_number,
                'buyer_id': order.buyer_id,
                'buyer': {
                    'id': order.buyer.id,
                    'email': order.buyer.email,
                    'full_name': order.buyer.full_name
                } if order.buyer else None,
                'delivery_address': {
                    'id': order.delivery_address.id,
                    'full_name': order.delivery_address.full_name,
                    'phone': order.delivery_address.phone,
                    'address_line_1': order.delivery_address.address_line_1,
                    'address_line_2': order.delivery_address.address_line_2,
                    'city': order.delivery_address.city,
                    'state': order.delivery_address.state,
                    'postal_code': order.delivery_address.postal_code,
                    'country': order.delivery_address.country
                } if order.delivery_address else None,
                'subtotal': float(order.subtotal),
                'tax_amount': float(order.tax_amount),
                'shipping_amount': float(order.shipping_amount),
                'discount_amount': float(order.discount_amount),
                'total_amount': float(order.total_amount),
                'status': order.status,
                'payment_status': order.payment_status,
                'razorpay_order_id': order.razorpay_order_id,
                'razorpay_payment_id': order.razorpay_payment_id,
                'notes': order.notes,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat() if order.updated_at else None,
                'order_items': [
                    {
                        'id': item.id,
                        'product_id': item.product_id,
                        'quantity': item.quantity,
                        'unit_price': float(item.unit_price),
                        'total_price': float(item.total_price),
                        'status': item.status,
                        'product': {
                            'id': item.product.id,
                            'name': item.product.name,
                            'sku': item.product.sku,
                            'category': item.product.category,
                            'price': float(item.product.price)
                        } if item.product else None
                    } for item in order.order_items if item.seller_id == current_seller.id
                ]
            })

        total_pages = (total + limit - 1) // limit
        return {
            'items': order_responses,
            'total': total,
            'page': page,
            'limit': limit,
            'pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }

    except Exception as e:
        logger.error(f"Error fetching seller orders: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch orders"
        )

@router.put("/{order_id}/status")
def update_order_status(
    order_id: int,
    status_update: dict,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Update order status (seller can update orders containing their products)"""
    try:
        new_status = status_update.get('status')
        if not new_status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status is required"
            )

        # Find order with seller's products
        order = db.query(Order).join(OrderItem).join(Product).filter(
            and_(
                Order.id == order_id,
                Product.seller_id == current_seller.id,
                Order.payment_status == PaymentStatus.COMPLETED
            )
        ).first()

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found or not accessible"
            )

        # Update status
        order.status = OrderStatus(new_status.lower())
        db.commit()

        logger.info(f"Order {order.order_number} status updated to {new_status} by seller {current_seller.id}")
        return {"message": "Order status updated successfully", "order_id": order.id}

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status: {new_status}"
        )
    except Exception as e:
        logger.error(f"Error updating order status: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update order status"
        )

@router.get("/", response_model=PaginatedResponse)
def get_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[OrderStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's orders"""
    try:
        query = db.query(Order).filter(Order.buyer_id == current_user.id)
        
        if status_filter:
            query = query.filter(Order.status == status_filter)
        
        # Get total count
        total = query.count()
        
        # Apply pagination and ordering
        orders = query.order_by(desc(Order.created_at)).offset((page - 1) * limit).limit(limit).all()
        
        # Transform to list response
        items = []
        for order in orders:
            items_count = db.query(OrderItem).filter(OrderItem.order_id == order.id).count()
            items.append(OrderListResponse(
                id=order.id,
                order_number=order.order_number,
                total_amount=order.total_amount,
                status=order.status,
                payment_status=order.payment_status,
                items_count=items_count,
                created_at=order.created_at
            ))
        
        pages = (total + limit - 1) // limit
        
        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            pages=pages,
            has_next=page < pages,
            has_prev=page > 1
        )
        
    except Exception as e:
        logger.error(f"Error fetching orders: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching orders"
        )

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get order by ID"""
    try:
        order = db.query(Order).options(
            joinedload(Order.delivery_address),
            joinedload(Order.order_items).joinedload(OrderItem.product).joinedload(Product.images),
            joinedload(Order.order_items).joinedload(OrderItem.product).joinedload(Product.seller)
        ).filter(Order.id == order_id).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Check permissions
        if current_user.role not in [UserRole.ADMIN] and order.buyer_id != current_user.id:
            # Check if user is a seller for any item in this order
            seller_check = db.query(OrderItem).filter(
                and_(OrderItem.order_id == order_id, OrderItem.seller_id == current_user.id)
            ).first()
            if not seller_check:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to view this order"
                )
        
        return order
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order {order_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching order"
        )

@router.put("/{order_id}/cancel")
def cancel_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel an order"""
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Check permissions
        if current_user.role != UserRole.ADMIN and order.buyer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to cancel this order"
            )
        
        # Check if order can be cancelled
        if order.status not in [OrderStatus.PENDING, OrderStatus.CONFIRMED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order cannot be cancelled at this stage"
            )
        
        # Update order status
        order.status = OrderStatus.CANCELLED
        
        # Restore stock quantities
        for item in order.order_items:
            item.product.stock_quantity += item.quantity
            item.status = OrderStatus.CANCELLED
        
        db.commit()
        
        logger.info(f"Order cancelled: {order.order_number}")
        return {"message": "Order cancelled successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling order: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error cancelling order"
        )

@router.get("/seller/", response_model=PaginatedResponse)
async def get_seller_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[OrderStatus] = None,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Get orders for seller's products"""
    try:
        query = db.query(OrderItem).options(
            joinedload(OrderItem.order).joinedload(Order.buyer),
            joinedload(OrderItem.order).joinedload(Order.delivery_address),
            joinedload(OrderItem.product)
        ).filter(OrderItem.seller_id == current_seller.id)
        
        if status_filter:
            query = query.filter(OrderItem.status == status_filter)
        
        # Get total count
        total = query.count()
        
        # Apply pagination and ordering
        order_items = query.order_by(desc(OrderItem.created_at)).offset((page - 1) * limit).limit(limit).all()
        
        # Transform to response format
        items = []
        for item in order_items:
            items.append({
                "id": item.order.id,
                "order_number": item.order.order_number,
                "buyer_name": f"{item.order.buyer.first_name} {item.order.buyer.last_name}",
                "product_name": item.product.name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "total_price": item.total_price,
                "seller_amount": item.seller_amount,
                "status": item.status,
                "order_status": item.order.status,
                "payment_status": item.order.payment_status,
                "created_at": item.created_at
            })
        
        pages = (total + limit - 1) // limit
        
        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            pages=pages,
            has_next=page < pages,
            has_prev=page > 1
        )
        
    except Exception as e:
        logger.error(f"Error fetching seller orders: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching seller orders"
        )

@router.put("/items/{item_id}/status")
def update_order_item_status(
    item_id: int,
    new_status: OrderStatus,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Update order item status (sellers can update their items)"""
    try:
        order_item = db.query(OrderItem).filter(OrderItem.id == item_id).first()
        if not order_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order item not found"
            )
        
        # Check permissions
        if current_seller.role != UserRole.ADMIN and order_item.seller_id != current_seller.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this order item"
            )
        
        # Update status
        order_item.status = new_status
        
        # Check if all items in order have the same status to update order status
        all_items = db.query(OrderItem).filter(OrderItem.order_id == order_item.order_id).all()
        if all(item.status == new_status for item in all_items):
            order_item.order.status = new_status
        
        db.commit()
        
        logger.info(f"Order item status updated: {item_id} -> {new_status}")
        return {"message": "Order item status updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating order item status: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating order item status"
        )
