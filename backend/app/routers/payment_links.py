"""
Payment Links API - Creates unique, locked-amount payment links
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.models import Product
from app.config import settings
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import logging
import uuid
import razorpay

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/payment-links", tags=["Payment Links"])

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))


class OrderItemCreate(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price: float


class PaymentLinkRequest(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    customer_address: str
    items: List[OrderItemCreate]
    total_amount: float
    notes: Optional[str] = None


class PaymentLinkResponse(BaseModel):
    payment_link_id: str
    short_url: str
    order_number: str
    amount: float
    currency: str
    status: str
    expires_at: int


@router.post("/create", response_model=PaymentLinkResponse)
async def create_payment_link(
    request: PaymentLinkRequest,
    db: Session = Depends(get_db)
):
    """
    Create a Razorpay Payment Link with LOCKED amount
    
    This creates a unique payment link for each order where:
    - Amount is pre-filled and LOCKED
    - Customer CANNOT change the amount
    - Link expires after 24 hours
    - Automatic payment verification
    """
    try:
        # Check stock availability first
        for item in request.items:
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
        
        # Create order in database (pending payment)
        from app.routers.guest_orders import create_guest_order_tables
        create_guest_order_tables(db)
        
        result = db.execute(text("""
            INSERT INTO guest_orders 
            (order_number, customer_name, customer_email, customer_phone, 
             customer_address, total_amount, payment_method, payment_status, order_status, notes)
            VALUES (:order_number, :customer_name, :customer_email, :customer_phone,
                    :customer_address, :total_amount, 'razorpay_link', 'pending', 'pending', :notes)
            RETURNING id
        """), {
            "order_number": order_number,
            "customer_name": request.customer_name,
            "customer_email": request.customer_email,
            "customer_phone": request.customer_phone,
            "customer_address": request.customer_address,
            "total_amount": request.total_amount,
            "notes": request.notes or "Payment via Razorpay Payment Link"
        })
        
        order_id = result.fetchone()[0]
        logger.info(f"Order created with ID: {order_id}, Order Number: {order_number}")
        
        # Insert order items
        for item in request.items:
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
        
        # Create Razorpay Payment Link with LOCKED amount
        amount_in_paise = int(request.total_amount * 100)
        
        # Check Razorpay Payment Link limits
        # Test Mode: Max ₹5,00,000 (5 lakh paise)
        # Live Mode: Much higher limits
        MAX_AMOUNT_TEST_MODE = 500000  # ₹5,000 in paise
        MAX_AMOUNT_LIVE_MODE = 100000000  # ₹10,00,000 in paise
        
        # Determine if in test or live mode based on key
        is_test_mode = settings.razorpay_key_id.startswith('rzp_test_')
        max_allowed = MAX_AMOUNT_TEST_MODE if is_test_mode else MAX_AMOUNT_LIVE_MODE
        
        if amount_in_paise > max_allowed:
            max_amount_rupees = max_allowed / 100
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Payment amount ₹{request.total_amount:,.2f} exceeds maximum allowed ₹{max_amount_rupees:,.2f} in {'test' if is_test_mode else 'live'} mode. Please contact support for large orders or enable live mode for higher limits."
            )
        
        # Build items description
        items_description = ", ".join([f"{item.product_name} x{item.quantity}" for item in request.items])
        
        payment_link_data = {
            "amount": amount_in_paise,  # Amount in paise (LOCKED!)
            "currency": "INR",
            "description": f"Payment for Order {order_number}",
            "customer": {
                "name": request.customer_name,
                "email": request.customer_email,
                "contact": request.customer_phone
            },
            "notify": {
                "sms": True,
                "email": True
            },
            "reminder_enable": True,
            "notes": {
                "order_number": order_number,
                "items": items_description
            },
            "callback_url": f"https://customer-website-lovat.vercel.app/payment/success?order={order_number}&email={request.customer_email}",
            "callback_method": "get"
        }
        
        logger.info(f"Creating Razorpay Payment Link for order {order_number}, amount: ₹{request.total_amount} ({'TEST' if is_test_mode else 'LIVE'} mode)")
        
        # Create payment link with retry logic
        max_retries = 3
        payment_link = None
        last_error = None
        
        for attempt in range(max_retries):
            try:
                payment_link = razorpay_client.payment_link.create(payment_link_data)
                logger.info(f"Payment Link created successfully: {payment_link['id']}, URL: {payment_link['short_url']}")
                break  # Success, exit retry loop
                
            except Exception as e:
                last_error = str(e)
                logger.warning(f"Razorpay API attempt {attempt + 1}/{max_retries} failed: {last_error}")
                
                # Check if it's a retryable error
                error_msg = str(e).lower()
                if 'timeout' in error_msg or 'connection' in error_msg or 'remote end closed' in error_msg:
                    if attempt < max_retries - 1:  # Don't sleep on last attempt
                        import time
                        time.sleep(2)  # Wait 2 seconds before retry
                        continue
                    else:
                        # Last retry failed
                        raise HTTPException(
                            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail=f"Payment gateway temporarily unavailable. Please try again in a moment or contact support: +91-9876543210"
                        )
                else:
                    # Non-retryable error, raise immediately
                    logger.error(f"Razorpay API error (non-retryable): {e}")
                    raise
        
        if not payment_link:
            # All retries failed
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Payment gateway temporarily unavailable. Please try again or contact support: +91-9876543210"
            )
        
        # Store payment link ID in order notes
        db.execute(text("""
            UPDATE guest_orders 
            SET notes = :notes
            WHERE order_number = :order_number
        """), {
            "notes": f"Payment Link ID: {payment_link['id']}, URL: {payment_link['short_url']}",
            "order_number": order_number
        })
        db.commit()
        
        return PaymentLinkResponse(
            payment_link_id=payment_link['id'],
            short_url=payment_link['short_url'],
            order_number=order_number,
            amount=request.total_amount,
            currency="INR",
            status=payment_link['status'],
            expires_at=payment_link['expire_by']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create payment link: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create payment link: {str(e)}"
        )


@router.post("/webhook")
async def payment_link_webhook(
    payload: dict,
    db: Session = Depends(get_db)
):
    """
    Webhook to receive payment status updates from Razorpay
    """
    try:
        event = payload.get('event')
        payment_link_data = payload.get('payload', {}).get('payment_link', {}).get('entity', {})
        
        if event == 'payment_link.paid':
            # Payment successful
            order_number = payment_link_data.get('notes', {}).get('order_number')
            
            if order_number:
                # Update order status
                db.execute(text("""
                    UPDATE guest_orders 
                    SET payment_status = 'completed',
                        order_status = 'processing',
                        updated_at = CURRENT_TIMESTAMP
                    WHERE order_number = :order_number
                """), {"order_number": order_number})
                
                # Decrement stock
                items = db.execute(text("""
                    SELECT * FROM guest_order_items 
                    WHERE order_id = (
                        SELECT id FROM guest_orders WHERE order_number = :order_number
                    )
                """), {"order_number": order_number}).fetchall()
                
                for item in items:
                    product = db.query(Product).filter(Product.id == item[2]).first()
                    if product and product.stock_quantity >= item[4]:
                        product.stock_quantity -= item[4]
                        logger.info(f"Stock decremented for {product.name}: -{item[4]}")
                
                db.commit()
                logger.info(f"Order {order_number} marked as paid via webhook")
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}
