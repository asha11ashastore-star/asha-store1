import razorpay
import hmac
import hashlib
from typing import Optional, Dict, Any
from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.config import settings
from app.models import Order, OrderStatus, PaymentStatus
import logging

logger = logging.getLogger(__name__)

class PaymentService:
    def __init__(self):
        self.client = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))
        self.webhook_secret = settings.razorpay_webhook_secret
    
    def create_order(self, order: Order) -> Dict[str, Any]:
        """Create Razorpay order"""
        try:
            # Convert amount to paise (Razorpay expects amount in smallest currency unit)
            amount_in_paise = int(order.total_amount * 100)
            
            razorpay_order = self.client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "receipt": order.order_number,
                "notes": {
                    "order_id": str(order.id),
                    "buyer_id": str(order.buyer_id)
                }
            })
            
            logger.info(f"Razorpay order created: {razorpay_order['id']} for order {order.id}")
            return razorpay_order
            
        except razorpay.errors.RazorpayError as e:
            logger.error(f"Razorpay order creation failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Payment order creation failed: {str(e)}"
            )
    
    def verify_payment_signature(
        self, 
        razorpay_order_id: str, 
        razorpay_payment_id: str, 
        razorpay_signature: str
    ) -> bool:
        """Verify Razorpay payment signature"""
        try:
            # Create the signature string
            signature_string = f"{razorpay_order_id}|{razorpay_payment_id}"
            
            # Generate expected signature
            expected_signature = hmac.new(
                settings.razorpay_key_secret.encode('utf-8'),
                signature_string.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            # Compare signatures
            return hmac.compare_digest(expected_signature, razorpay_signature)
            
        except Exception as e:
            logger.error(f"Signature verification failed: {e}")
            return False
    
    def verify_webhook_signature(self, payload: bytes, webhook_signature: str) -> bool:
        """Verify webhook signature"""
        try:
            expected_signature = hmac.new(
                self.webhook_secret.encode('utf-8'),
                payload,
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(expected_signature, webhook_signature)
            
        except Exception as e:
            logger.error(f"Webhook signature verification failed: {e}")
            return False
    
    def get_payment_details(self, payment_id: str) -> Optional[Dict[str, Any]]:
        """Get payment details from Razorpay"""
        try:
            payment = self.client.payment.fetch(payment_id)
            return payment
        except razorpay.errors.RazorpayError as e:
            logger.error(f"Failed to fetch payment details: {e}")
            return None
    
    def create_refund(
        self, 
        payment_id: str, 
        amount: Optional[Decimal] = None, 
        notes: Optional[Dict[str, str]] = None
    ) -> Optional[Dict[str, Any]]:
        """Create refund for a payment"""
        try:
            refund_data = {}
            
            if amount:
                refund_data["amount"] = int(amount * 100)  # Convert to paise
            
            if notes:
                refund_data["notes"] = notes
            
            refund = self.client.payment.refund(payment_id, refund_data)
            logger.info(f"Refund created: {refund['id']} for payment {payment_id}")
            return refund
            
        except razorpay.errors.RazorpayError as e:
            logger.error(f"Refund creation failed: {e}")
            return None
    
    def handle_payment_success(self, db: Session, payment_data: Dict[str, Any]):
        """Handle successful payment webhook"""
        try:
            payment_id = payment_data.get("id")
            order_id = payment_data.get("order_id")
            
            # Find the order
            order = db.query(Order).filter(Order.razorpay_order_id == order_id).first()
            if not order:
                logger.error(f"Order not found for Razorpay order ID: {order_id}")
                return
            
            # Update order with payment details
            order.razorpay_payment_id = payment_id
            order.payment_status = PaymentStatus.COMPLETED
            order.status = OrderStatus.CONFIRMED
            
            # Update stock quantities
            for item in order.order_items:
                if item.product.stock_quantity >= item.quantity:
                    item.product.stock_quantity -= item.quantity
                else:
                    logger.warning(f"Insufficient stock for product {item.product_id}")
            
            db.commit()
            logger.info(f"Payment success processed for order {order.id}")
            
        except Exception as e:
            logger.error(f"Error processing payment success: {e}")
            db.rollback()
            raise
    
    def handle_payment_failure(self, db: Session, payment_data: Dict[str, Any]):
        """Handle failed payment webhook"""
        try:
            order_id = payment_data.get("order_id")
            
            # Find the order
            order = db.query(Order).filter(Order.razorpay_order_id == order_id).first()
            if not order:
                logger.error(f"Order not found for Razorpay order ID: {order_id}")
                return
            
            # Update order status
            order.payment_status = PaymentStatus.FAILED
            order.status = OrderStatus.CANCELLED
            
            db.commit()
            logger.info(f"Payment failure processed for order {order.id}")
            
        except Exception as e:
            logger.error(f"Error processing payment failure: {e}")
            db.rollback()
            raise
    
    def create_payout(
        self, 
        account_number: str, 
        amount: Decimal, 
        purpose: str = "payout",
        reference_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Create payout to seller account"""
        try:
            payout_data = {
                "account_number": account_number,
                "amount": int(amount * 100),  # Convert to paise
                "currency": "INR",
                "mode": "IMPS",
                "purpose": purpose,
                "queue_if_low_balance": True
            }
            
            if reference_id:
                payout_data["reference_id"] = reference_id
            
            payout = self.client.payout.create(payout_data)
            logger.info(f"Payout created: {payout['id']}")
            return payout
            
        except razorpay.errors.RazorpayError as e:
            logger.error(f"Payout creation failed: {e}")
            return None

# Create payment service instance
payment_service = PaymentService()
