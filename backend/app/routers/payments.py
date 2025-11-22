from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import PaymentOrderCreate, PaymentOrderResponse, PaymentVerification, RefundRequest
from app.models import Order, OrderStatus, PaymentStatus, User, UserRole
from app.auth import get_current_user, get_current_admin
from app.services.payment import payment_service
from app.services.email import email_service
import logging
import json

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/payment", tags=["Payments"])

@router.post("/create-order", response_model=PaymentOrderResponse)
async def create_payment_order(
    payment_data: PaymentOrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create Razorpay order for payment"""
    try:
        # Get order
        order = db.query(Order).filter(Order.id == payment_data.order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Check permissions
        if order.buyer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to create payment for this order"
            )
        
        # Check if order is in correct state
        if order.status != OrderStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order is not in pending state"
            )
        
        # Create Razorpay order
        razorpay_order = payment_service.create_order(order)
        
        # Update order with Razorpay order ID
        order.razorpay_order_id = razorpay_order["id"]
        db.commit()
        
        return PaymentOrderResponse(
            razorpay_order_id=razorpay_order["id"],
            amount=razorpay_order["amount"],
            currency=razorpay_order["currency"],
            order_id=order.id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment order creation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Payment order creation failed"
        )

@router.post("/verify")
async def verify_payment(
    verification_data: PaymentVerification,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verify payment after successful payment"""
    try:
        # Find order by Razorpay order ID
        order = db.query(Order).filter(
            Order.razorpay_order_id == verification_data.razorpay_order_id
        ).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Check permissions
        if order.buyer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to verify payment for this order"
            )
        
        # Verify payment signature
        is_valid = payment_service.verify_payment_signature(
            verification_data.razorpay_order_id,
            verification_data.razorpay_payment_id,
            verification_data.razorpay_signature
        )
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payment signature"
            )
        
        # Update order with payment details
        order.razorpay_payment_id = verification_data.razorpay_payment_id
        order.payment_status = PaymentStatus.COMPLETED
        order.status = OrderStatus.CONFIRMED
        
        # Update stock quantities
        for item in order.order_items:
            if item.product.stock_quantity >= item.quantity:
                item.product.stock_quantity -= item.quantity
            else:
                logger.warning(f"Insufficient stock for product {item.product_id}")
        
        db.commit()
        
        # Send order confirmation email
        try:
            email_service.send_order_confirmation_email(order)
        except Exception as e:
            logger.error(f"Failed to send order confirmation email: {e}")
        
        logger.info(f"Payment verified successfully for order {order.order_number}")
        return {"message": "Payment verified successfully", "order_id": order.id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment verification failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Payment verification failed"
        )

@router.post("/webhook")
async def payment_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Razorpay webhook notifications"""
    try:
        # Get raw request body
        body = await request.body()
        
        # Get webhook signature from headers
        webhook_signature = request.headers.get("X-Razorpay-Signature")
        if not webhook_signature:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing webhook signature"
            )
        
        # Verify webhook signature
        is_valid = payment_service.verify_webhook_signature(body, webhook_signature)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid webhook signature"
            )
        
        # Parse webhook payload
        payload = json.loads(body.decode('utf-8'))
        event = payload.get("event")
        payment_data = payload.get("payload", {}).get("payment", {}).get("entity", {})
        
        if event == "payment.captured":
            # Handle successful payment
            payment_service.handle_payment_success(db, payment_data)
            
        elif event == "payment.failed":
            # Handle failed payment
            payment_service.handle_payment_failure(db, payment_data)
        
        return {"status": "ok"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Webhook processing failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook processing failed"
        )

@router.post("/refund")
async def create_refund(
    refund_data: RefundRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create refund for an order (admin only)"""
    try:
        # Get order
        order = db.query(Order).filter(Order.id == refund_data.order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Check if order can be refunded
        if order.payment_status != PaymentStatus.COMPLETED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order payment is not completed"
            )
        
        if not order.razorpay_payment_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No payment ID found for this order"
            )
        
        # Create refund with Razorpay
        refund_amount = refund_data.amount or order.total_amount
        notes = {"reason": refund_data.reason or "Refund requested by admin"}
        
        refund = payment_service.create_refund(
            order.razorpay_payment_id,
            refund_amount,
            notes
        )
        
        if not refund:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Refund creation failed"
            )
        
        # Update order status
        order.status = OrderStatus.REFUNDED
        order.payment_status = PaymentStatus.REFUNDED
        
        # Restore stock quantities
        for item in order.order_items:
            item.product.stock_quantity += item.quantity
            item.status = OrderStatus.REFUNDED
        
        db.commit()
        
        # Send refund notification email
        try:
            email_service.send_order_status_update_email(order, "refunded")
        except Exception as e:
            logger.error(f"Failed to send refund notification email: {e}")
        
        logger.info(f"Refund created for order {order.order_number}: {refund['id']}")
        return {
            "message": "Refund created successfully",
            "refund_id": refund["id"],
            "amount": refund_amount
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Refund creation failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Refund creation failed"
        )

@router.get("/orders/{order_id}/payment-status")
async def get_payment_status(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get payment status for an order"""
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
                detail="Not authorized to view payment status for this order"
            )
        
        return {
            "order_id": order.id,
            "order_number": order.order_number,
            "payment_status": order.payment_status,
            "razorpay_order_id": order.razorpay_order_id,
            "razorpay_payment_id": order.razorpay_payment_id,
            "total_amount": order.total_amount
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching payment status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching payment status"
        )
