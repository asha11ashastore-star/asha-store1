from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.schemas import CartItemCreate, CartItemUpdate, CartItemResponse, CartResponse
from app.models import CartItem, Product, User
from app.auth import get_current_user
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's cart items"""
    try:
        cart_items = db.query(CartItem).options(
            joinedload(CartItem.product).joinedload(Product.images),
            joinedload(CartItem.product).joinedload(Product.seller)
        ).filter(CartItem.user_id == current_user.id).all()
        
        # Calculate totals
        total_items = sum(item.quantity for item in cart_items)
        subtotal = sum(
            item.quantity * (item.product.discounted_price or item.product.price) 
            for item in cart_items
        )
        
        return CartResponse(
            items=cart_items,
            total_items=total_items,
            subtotal=subtotal
        )
        
    except Exception as e:
        logger.error(f"Error fetching cart: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching cart"
        )

@router.post("/items", response_model=CartItemResponse)
async def add_to_cart(
    item_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add item to cart"""
    try:
        # Check if product exists and is active
        product = db.query(Product).filter(Product.id == item_data.product_id).first()
        if not product or product.status != 'active':
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found or inactive"
            )
        
        # Check stock availability
        if product.stock_quantity < item_data.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {product.stock_quantity} items available in stock"
            )
        
        # Check if item already exists in cart
        existing_item = db.query(CartItem).filter(
            CartItem.user_id == current_user.id,
            CartItem.product_id == item_data.product_id
        ).first()
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item.quantity + item_data.quantity
            if product.stock_quantity < new_quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot add {item_data.quantity} more items. Only {product.stock_quantity - existing_item.quantity} more available"
                )
            existing_item.quantity = new_quantity
            db.commit()
            db.refresh(existing_item)
            return existing_item
        else:
            # Create new cart item
            cart_item = CartItem(
                user_id=current_user.id,
                product_id=item_data.product_id,
                quantity=item_data.quantity
            )
            db.add(cart_item)
            db.commit()
            db.refresh(cart_item)
            return cart_item
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding to cart: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error adding item to cart"
        )

@router.put("/items/{item_id}", response_model=CartItemResponse)
async def update_cart_item(
    item_id: int,
    item_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update cart item quantity"""
    try:
        cart_item = db.query(CartItem).filter(
            CartItem.id == item_id,
            CartItem.user_id == current_user.id
        ).first()
        
        if not cart_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cart item not found"
            )
        
        # Check stock availability
        if cart_item.product.stock_quantity < item_data.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {cart_item.product.stock_quantity} items available in stock"
            )
        
        cart_item.quantity = item_data.quantity
        db.commit()
        db.refresh(cart_item)
        
        return cart_item
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating cart item: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating cart item"
        )

@router.delete("/items/{item_id}")
async def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove item from cart"""
    try:
        cart_item = db.query(CartItem).filter(
            CartItem.id == item_id,
            CartItem.user_id == current_user.id
        ).first()
        
        if not cart_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cart item not found"
            )
        
        db.delete(cart_item)
        db.commit()
        
        return {"message": "Item removed from cart"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error removing from cart: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error removing item from cart"
        )

@router.delete("/clear")
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear all items from cart"""
    try:
        db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
        db.commit()
        
        return {"message": "Cart cleared successfully"}
        
    except Exception as e:
        logger.error(f"Error clearing cart: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error clearing cart"
        )

@router.get("/count")
async def get_cart_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get total number of items in cart"""
    try:
        total_items = db.query(CartItem).filter(
            CartItem.user_id == current_user.id
        ).count()
        
        return {"count": total_items}
        
    except Exception as e:
        logger.error(f"Error getting cart count: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error getting cart count"
        )
