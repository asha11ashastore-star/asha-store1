"""
Guest Order Management - For customers without accounts
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.auth import get_current_seller
from app.models import User, Product
from app.services.payment import payment_service
from app.config import settings
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import logging
import uuid

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/guest-orders", tags=["Guest Orders"])

# Pydantic Models
class OrderItemCreate(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price: float

class GuestOrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    customer_address: str
    items: List[OrderItemCreate]
    total_amount: float
    payment_method: str = "manual"  # manual, razorpay, etc.
    notes: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    price: float
    total: float

class GuestOrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_address: str
    items: List[OrderItemResponse]
    total_amount: float
    payment_method: str
    payment_status: str
    order_status: str
    notes: Optional[str]
    created_at: str

class RazorpayOrderResponse(BaseModel):
    razorpay_order_id: str
    razorpay_key_id: str
    amount: int
    currency: str
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str

class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_number: str

# Create tables if they don't exist
def create_guest_order_tables(db: Session):
    """Create guest order tables - PostgreSQL compatible"""
    # Check database type
    from app.config import settings
    is_postgres = settings.database_url.startswith("postgresql")
    
    # Use appropriate syntax for auto-increment
    id_column = "SERIAL PRIMARY KEY" if is_postgres else "INTEGER PRIMARY KEY AUTOINCREMENT"
    timestamp_default = "NOW()" if is_postgres else "CURRENT_TIMESTAMP"
    
    db.execute(text(f"""
        CREATE TABLE IF NOT EXISTS guest_orders (
            id {id_column},
            order_number TEXT UNIQUE NOT NULL,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            customer_address TEXT NOT NULL,
            total_amount REAL NOT NULL,
            payment_method TEXT DEFAULT 'manual',
            payment_status TEXT DEFAULT 'pending',
            order_status TEXT DEFAULT 'pending',
            notes TEXT,
            created_at TIMESTAMP DEFAULT {timestamp_default},
            updated_at TIMESTAMP DEFAULT {timestamp_default}
        )
    """))
    
    db.execute(text(f"""
        CREATE TABLE IF NOT EXISTS guest_order_items (
            id {id_column},
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            total REAL NOT NULL,
            created_at TIMESTAMP DEFAULT {timestamp_default},
            FOREIGN KEY (order_id) REFERENCES guest_orders (id)
        )
    """))
    
    db.commit()

@router.post("", response_model=GuestOrderResponse)
async def create_guest_order(
    order_data: GuestOrderCreate,
    db: Session = Depends(get_db)
):
    """Create a new guest order (no authentication required)"""
    try:
        # Ensure tables exist
        create_guest_order_tables(db)
        
        # Check stock availability for all items BEFORE creating order
        for item in order_data.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product '{item.product_name}' not found"
                )
            
            if product.stock_quantity < item.quantity:
                if product.stock_quantity == 0:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"'{item.product_name}' is out of stock"
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Only {product.stock_quantity} units of '{item.product_name}' available"
                    )
        
        # Generate unique order number
        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        
        # Insert order - PostgreSQL compatible (use RETURNING)
        result = db.execute(text("""
            INSERT INTO guest_orders 
            (order_number, customer_name, customer_email, customer_phone, 
             customer_address, total_amount, payment_method, notes)
            VALUES (:order_number, :customer_name, :customer_email, :customer_phone,
                    :customer_address, :total_amount, :payment_method, :notes)
            RETURNING id
        """), {
            "order_number": order_number,
            "customer_name": order_data.customer_name,
            "customer_email": order_data.customer_email,
            "customer_phone": order_data.customer_phone,
            "customer_address": order_data.customer_address,
            "total_amount": order_data.total_amount,
            "payment_method": order_data.payment_method,
            "notes": order_data.notes
        })
        
        # Get the returned ID from PostgreSQL
        order_id = result.fetchone()[0]
        logger.info(f"Order created with ID: {order_id}")
        
        # Insert order items AND decrement stock
        for item in order_data.items:
            item_total = item.price * item.quantity
            db.execute(text("""
                INSERT INTO guest_order_items
                (order_id, product_id, product_name, quantity, price, total)
                VALUES (:order_id, :product_id, :product_name, :quantity, :price, :total)
            """), {
                "order_id": order_id,
                "product_id": item.product_id,
                "product_name": item.product_name,
                "quantity": item.quantity,
                "price": item.price,
                "total": item_total
            })
            
            # Decrement product stock
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                product.stock_quantity -= item.quantity
                logger.info(f"Stock updated for {product.name}: {product.stock_quantity + item.quantity} -> {product.stock_quantity}")
        
        db.commit()
        
        # Fetch the created order
        order = db.execute(text("""
            SELECT * FROM guest_orders WHERE id = :id
        """), {"id": order_id}).fetchone()
        
        # Fetch order items
        items_result = db.execute(text("""
            SELECT * FROM guest_order_items WHERE order_id = :order_id
        """), {"order_id": order_id}).fetchall()
        
        # Format response
        order_items = [
            OrderItemResponse(
                id=item[0],
                product_id=item[2],
                product_name=item[3],
                quantity=item[4],
                price=item[5],
                total=item[6]
            ) for item in items_result
        ]
        
        return GuestOrderResponse(
            id=order[0],
            order_number=order[1],
            customer_name=order[2],
            customer_email=order[3],
            customer_phone=order[4],
            customer_address=order[5],
            total_amount=order[6],
            payment_method=order[7],
            payment_status=order[8],
            order_status=order[9],
            notes=order[10],
            created_at=str(order[11]),
            items=order_items
        )
        
    except Exception as e:
        logger.error(f"Failed to create guest order: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create order: {str(e)}"
        )

@router.get("", response_model=List[GuestOrderResponse])
async def get_all_orders(
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Get all guest orders (seller/admin only)"""
    try:
        # Ensure tables exist
        create_guest_order_tables(db)
        
        # Fetch all orders
        orders = db.execute(text("""
            SELECT * FROM guest_orders ORDER BY created_at DESC
        """)).fetchall()
        
        result = []
        for order in orders:
            # Fetch items for this order
            items_result = db.execute(text("""
                SELECT * FROM guest_order_items WHERE order_id = :order_id
            """), {"order_id": order[0]}).fetchall()
            
            order_items = [
                OrderItemResponse(
                    id=item[0],
                    product_id=item[2],
                    product_name=item[3],
                    quantity=item[4],
                    price=item[5],
                    total=item[6]
                ) for item in items_result
            ]
            
            result.append(GuestOrderResponse(
                id=order[0],
                order_number=order[1],
                customer_name=order[2],
                customer_email=order[3],
                customer_phone=order[4],
                customer_address=order[5],
                total_amount=order[6],
                payment_method=order[7],
                payment_status=order[8],
                order_status=order[9],
                notes=order[10],
                created_at=str(order[11]),
                items=order_items
            ))
        
        return result
        
    except Exception as e:
        logger.error(f"Failed to fetch orders: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch orders: {str(e)}"
        )

@router.get("/{order_id}", response_model=GuestOrderResponse)
async def get_order(
    order_id: int,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Get a specific order by ID"""
    try:
        order = db.execute(text("""
            SELECT * FROM guest_orders WHERE id = :id
        """), {"id": order_id}).fetchone()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Fetch order items
        items_result = db.execute(text("""
            SELECT * FROM guest_order_items WHERE order_id = :order_id
        """), {"order_id": order_id}).fetchall()
        
        order_items = [
            OrderItemResponse(
                id=item[0],
                product_id=item[2],
                product_name=item[3],
                quantity=item[4],
                price=item[5],
                total=item[6]
            ) for item in items_result
        ]
        
        return GuestOrderResponse(
            id=order[0],
            order_number=order[1],
            customer_name=order[2],
            customer_email=order[3],
            customer_phone=order[4],
            customer_address=order[5],
            total_amount=order[6],
            payment_method=order[7],
            payment_status=order[8],
            order_status=order[9],
            notes=order[10],
            created_at=str(order[11]),
            items=order_items
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch order: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch order: {str(e)}"
        )

@router.put("/{order_id}/status")
async def update_order_status(
    order_id: int,
    order_status: str,
    payment_status: Optional[str] = None,
    current_seller: User = Depends(get_current_seller),
    db: Session = Depends(get_db)
):
    """Update order status"""
    try:
        # Check if order exists
        order = db.execute(text("""
            SELECT id FROM guest_orders WHERE id = :id
        """), {"id": order_id}).fetchone()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Update order
        if payment_status:
            db.execute(text("""
                UPDATE guest_orders 
                SET order_status = :order_status, 
                    payment_status = :payment_status,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = :id
            """), {
                "id": order_id,
                "order_status": order_status,
                "payment_status": payment_status
            })
        else:
            db.execute(text("""
                UPDATE guest_orders 
                SET order_status = :order_status,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = :id
            """), {
                "id": order_id,
                "order_status": order_status
            })
        
        db.commit()
        
        return {"message": "Order status updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update order status: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update order status: {str(e)}"
        )

@router.post("/create-razorpay-order", response_model=RazorpayOrderResponse)
async def create_razorpay_order(
    order_data: GuestOrderCreate,
    db: Session = Depends(get_db)
):
    """
    Create Razorpay order for guest checkout
    Amount is LOCKED - customer cannot change it
    """
    try:
        # Ensure tables exist
        create_guest_order_tables(db)
        
        # Check stock availability FIRST
        for item in order_data.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product '{item.product_name}' not found"
                )
            
            if product.stock_quantity < item.quantity:
                if product.stock_quantity == 0:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"'{item.product_name}' is out of stock"
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Only {product.stock_quantity} units of '{item.product_name}' available"
                    )
        
        # Generate unique order number
        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        
        # Create order in database (pending payment) - PostgreSQL compatible
        result = db.execute(text("""
            INSERT INTO guest_orders 
            (order_number, customer_name, customer_email, customer_phone, 
             customer_address, total_amount, payment_method, payment_status, order_status, notes)
            VALUES (:order_number, :customer_name, :customer_email, :customer_phone,
                    :customer_address, :total_amount, 'razorpay', 'pending', 'pending', :notes)
            RETURNING id
        """), {
            "order_number": order_number,
            "customer_name": order_data.customer_name,
            "customer_email": order_data.customer_email,
            "customer_phone": order_data.customer_phone,
            "customer_address": order_data.customer_address,
            "total_amount": order_data.total_amount,
            "notes": order_data.notes or "Payment via Razorpay"
        })
        
        # Get the returned ID from PostgreSQL
        order_id = result.fetchone()[0]
        logger.info(f"Razorpay order created with ID: {order_id}")
        
        # Insert order items (don't decrement stock yet - wait for payment)
        for item in order_data.items:
            item_total = item.price * item.quantity
            db.execute(text("""
                INSERT INTO guest_order_items
                (order_id, product_id, product_name, quantity, price, total)
                VALUES (:order_id, :product_id, :product_name, :quantity, :price, :total)
            """), {
                "order_id": order_id,
                "product_id": item.product_id,
                "product_name": item.product_name,
                "quantity": item.quantity,
                "price": item.price,
                "total": item_total
            })
        
        db.commit()
        
        # Create Razorpay order with LOCKED amount
        amount_in_paise = int(order_data.total_amount * 100)  # Convert to paise
        
        import razorpay
        client = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))
        
        razorpay_order = client.order.create({
            "amount": amount_in_paise,  # LOCKED amount in paise
            "currency": "INR",
            "receipt": order_number,
            "notes": {
                "order_number": order_number,
                "customer_name": order_data.customer_name,
                "customer_email": order_data.customer_email
            }
        })
        
        # Store Razorpay order ID
        db.execute(text("""
            UPDATE guest_orders 
            SET notes = :notes
            WHERE order_number = :order_number
        """), {
            "notes": f"Razorpay Order ID: {razorpay_order['id']}",
            "order_number": order_number
        })
        db.commit()
        
        logger.info(f"Razorpay order created: {razorpay_order['id']} for order {order_number}")
        
        return RazorpayOrderResponse(
            razorpay_order_id=razorpay_order['id'],
            razorpay_key_id=settings.razorpay_key_id,
            amount=amount_in_paise,
            currency="INR",
            order_number=order_number,
            customer_name=order_data.customer_name,
            customer_email=order_data.customer_email,
            customer_phone=order_data.customer_phone
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create Razorpay order: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create payment order: {str(e)}"
        )

@router.post("/verify-payment")
async def verify_razorpay_payment(
    payment_data: PaymentVerification,
    db: Session = Depends(get_db)
):
    """
    Verify Razorpay payment and complete order
    """
    try:
        # Verify payment signature
        import hmac
        import hashlib
        
        signature_string = f"{payment_data.razorpay_order_id}|{payment_data.razorpay_payment_id}"
        expected_signature = hmac.new(
            settings.razorpay_key_secret.encode('utf-8'),
            signature_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(expected_signature, payment_data.razorpay_signature):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payment signature"
            )
        
        # Find order
        order = db.execute(text("""
            SELECT * FROM guest_orders WHERE order_number = :order_number
        """), {"order_number": payment_data.order_number}).fetchone()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Get order items
        items = db.execute(text("""
            SELECT * FROM guest_order_items WHERE order_id = :order_id
        """), {"order_id": order[0]}).fetchall()
        
        # Decrement stock NOW (payment verified)
        for item in items:
            product = db.query(Product).filter(Product.id == item[2]).first()
            if product:
                if product.stock_quantity >= item[4]:  # quantity
                    product.stock_quantity -= item[4]
                    logger.info(f"Stock decremented for {product.name}: {product.stock_quantity + item[4]} -> {product.stock_quantity}")
                else:
                    logger.warning(f"Insufficient stock for product {product.name}")
        
        # Update order status to completed
        db.execute(text("""
            UPDATE guest_orders 
            SET payment_status = 'completed',
                order_status = 'processing',
                notes = :notes,
                updated_at = CURRENT_TIMESTAMP
            WHERE order_number = :order_number
        """), {
            "notes": f"Payment ID: {payment_data.razorpay_payment_id} | Order ID: {payment_data.razorpay_order_id}",
            "order_number": payment_data.order_number
        })
        
        db.commit()
        
        logger.info(f"Payment verified and completed for order {payment_data.order_number}")
        
        return {
            "success": True,
            "message": "Payment verified successfully",
            "order_number": payment_data.order_number,
            "payment_id": payment_data.razorpay_payment_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment verification failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment verification failed: {str(e)}"
        )
