"""
Razorpay Payment Link API Endpoints
Generates payment links with locked amounts for products
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.services.razorpay_payment_link import payment_link_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/payment-link", tags=["Payment Links"])

class PaymentLinkRequest(BaseModel):
    product_id: int
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None

class SimplePaymentLinkRequest(BaseModel):
    product_id: int

@router.post("/create")
async def create_payment_link(
    request: PaymentLinkRequest,
    db: Session = Depends(get_db)
):
    """
    Create a Razorpay payment link for a product with locked amount
    Customer cannot edit the price
    """
    try:
        # Get product details
        product_query = text("""
            SELECT id, name, price, discounted_price
            FROM products
            WHERE id = :product_id AND status = 'active'
        """)
        
        result = db.execute(product_query, {"product_id": request.product_id})
        product = result.fetchone()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Calculate final price (use discounted price if available)
        final_price = float(product[3]) if product[3] else float(product[2])
        product_name = product[1]
        
        # Create payment link with locked amount
        payment_link = payment_link_service.create_payment_link(
            amount=final_price,
            product_name=product_name,
            customer_name=request.customer_name,
            customer_email=request.customer_email,
            customer_phone=request.customer_phone
        )
        
        if payment_link["success"]:
            return {
                "success": True,
                "payment_url": payment_link["payment_link_url"],
                "amount": final_price,
                "product_name": product_name,
                "message": "Payment link created. Amount is locked and cannot be edited."
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create payment link: {payment_link.get('error')}"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating payment link: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating payment link: {str(e)}"
        )

@router.post("/create-simple")
async def create_simple_payment_link(
    request: SimplePaymentLinkRequest,
    db: Session = Depends(get_db)
):
    """
    Create a simple Razorpay.me payment link with pre-filled amount
    Uses: https://razorpay.me/@ashadhaundiyal?amount=3500&purpose=Product
    """
    try:
        # Get product details
        product_query = text("""
            SELECT id, name, price, discounted_price
            FROM products
            WHERE id = :product_id AND status = 'active'
        """)
        
        result = db.execute(product_query, {"product_id": request.product_id})
        product = result.fetchone()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Calculate final price (use discounted price if available)
        final_price = float(product[3]) if product[3] else float(product[2])
        product_name = product[1]
        
        # Create simple payment URL
        payment_url = payment_link_service.create_simple_payment_url(
            amount=final_price,
            product_name=product_name
        )
        
        return {
            "success": True,
            "payment_url": payment_url,
            "amount": final_price,
            "product_name": product_name,
            "message": "Redirect customer to this URL. Amount is pre-filled."
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating simple payment link: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating payment link: {str(e)}"
        )

@router.get("/status/{payment_link_id}")
async def check_payment_status(payment_link_id: str):
    """Check the status of a payment link"""
    try:
        status_info = payment_link_service.check_payment_status(payment_link_id)
        
        if status_info["success"]:
            return status_info
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to check payment status: {status_info.get('error')}"
            )
    
    except Exception as e:
        logger.error(f"Error checking payment status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking payment status: {str(e)}"
        )
