# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail, Email, To, Content
from typing import Dict, Any, List, Optional
# from jinja2 import Environment, FileSystemLoader, Template
from app.config import settings
from app.models import User, Order
import logging
import os

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        # SendGrid disabled - email functionality optional
        # self.sg = SendGridAPIClient(api_key=settings.sendgrid_api_key)
        # self.from_email = Email(settings.from_email, settings.from_name)
        self.sg = None
        self.from_email = None
        self.jinja_env = None
        
        # Setup Jinja2 environment for email templates (DISABLED)
        # template_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'templates', 'emails')
        # self.jinja_env = Environment(
        #     loader=FileSystemLoader(template_dir),
        #     autoescape=True
        # )
    
    def send_email(
        self, 
        to_email: str, 
        subject: str, 
        html_content: str,
        plain_content: Optional[str] = None,
        template_data: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Send email using SendGrid (DISABLED - just logging)"""
        logger.info(f"Email sending disabled - would send to {to_email} with subject: {subject}")
        return True  # Return True to not break application flow
    
    def render_template(self, template_name: str, context: Dict[str, Any]) -> str:
        """Render email template (DISABLED)"""
        logger.info(f"Email template rendering disabled - would render: {template_name}")
        return ""  # Return empty string
    
    def send_welcome_email(self, user: User) -> bool:
        """Send welcome email to new user"""
        context = {
            "user_name": f"{user.first_name} {user.last_name}",
            "user_email": user.email,
            "login_url": f"{settings.frontend_url}/login",
            "support_email": settings.from_email
        }
        
        html_content = self.render_template("welcome.html", context)
        if not html_content:
            return False
        
        return self.send_email(
            to_email=user.email,
            subject="Welcome to ShopAll!",
            html_content=html_content
        )
    
    def send_seller_verification_email(self, user: User, verification_token: str) -> bool:
        """Send verification email to seller"""
        context = {
            "seller_name": f"{user.first_name} {user.last_name}",
            "verification_url": f"{settings.frontend_url}/seller/verify?token={verification_token}",
            "support_email": settings.from_email
        }
        
        html_content = self.render_template("seller_verification.html", context)
        if not html_content:
            return False
        
        return self.send_email(
            to_email=user.email,
            subject="Verify Your Seller Account - ShopAll",
            html_content=html_content
        )
    
    def send_order_confirmation_email(self, order: Order) -> bool:
        """Send order confirmation email"""
        context = {
            "customer_name": f"{order.buyer.first_name} {order.buyer.last_name}",
            "order_number": order.order_number,
            "order_total": str(order.total_amount),
            "order_date": order.created_at.strftime("%B %d, %Y"),
            "order_items": [
                {
                    "name": item.product.name,
                    "quantity": item.quantity,
                    "price": str(item.unit_price),
                    "total": str(item.total_price)
                }
                for item in order.order_items
            ],
            "delivery_address": {
                "name": order.delivery_address.full_name,
                "address": f"{order.delivery_address.address_line_1}, {order.delivery_address.city}",
                "phone": order.delivery_address.phone
            },
            "order_url": f"{settings.frontend_url}/orders/{order.id}",
            "support_email": settings.from_email
        }
        
        html_content = self.render_template("order_confirmation.html", context)
        if not html_content:
            return False
        
        return self.send_email(
            to_email=order.buyer.email,
            subject=f"Order Confirmation - {order.order_number}",
            html_content=html_content
        )
    
    def send_order_status_update_email(self, order: Order, new_status: str) -> bool:
        """Send order status update email"""
        status_messages = {
            "confirmed": "Your order has been confirmed and is being prepared.",
            "processing": "Your order is being processed and will be shipped soon.",
            "shipped": "Your order has been shipped and is on its way to you.",
            "delivered": "Your order has been delivered successfully.",
            "cancelled": "Your order has been cancelled.",
            "refunded": "Your order has been refunded."
        }
        
        context = {
            "customer_name": f"{order.buyer.first_name} {order.buyer.last_name}",
            "order_number": order.order_number,
            "status": new_status.title(),
            "status_message": status_messages.get(new_status, "Your order status has been updated."),
            "order_url": f"{settings.frontend_url}/orders/{order.id}",
            "support_email": settings.from_email
        }
        
        html_content = self.render_template("order_status_update.html", context)
        if not html_content:
            return False
        
        return self.send_email(
            to_email=order.buyer.email,
            subject=f"Order Update - {order.order_number}",
            html_content=html_content
        )
    
    def send_payout_notification_email(self, seller: User, amount: float, payout_id: str) -> bool:
        """Send payout notification email to seller"""
        context = {
            "seller_name": f"{seller.first_name} {seller.last_name}",
            "payout_amount": f"₹{amount:,.2f}",
            "payout_id": payout_id,
            "payout_date": "within 2-3 business days",
            "dashboard_url": f"{settings.frontend_url}/seller/dashboard",
            "support_email": settings.from_email
        }
        
        html_content = self.render_template("payout_notification.html", context)
        if not html_content:
            return False
        
        return self.send_email(
            to_email=seller.email,
            subject=f"Payout Processed - ₹{amount:,.2f}",
            html_content=html_content
        )
    
    def send_password_reset_email(self, user: User, reset_token: str) -> bool:
        """Send password reset email"""
        context = {
            "user_name": f"{user.first_name} {user.last_name}",
            "reset_url": f"{settings.frontend_url}/reset-password?token={reset_token}",
            "expiry_time": "1 hour",
            "support_email": settings.from_email
        }
        
        html_content = self.render_template("password_reset.html", context)
        if not html_content:
            return False
        
        return self.send_email(
            to_email=user.email,
            subject="Reset Your Password - ShopAll",
            html_content=html_content
        )
    
    def send_bulk_notification(
        self, 
        recipients: List[str], 
        subject: str, 
        template_name: str,
        context: Dict[str, Any]
    ) -> bool:
        """Send bulk email notification"""
        html_content = self.render_template(template_name, context)
        if not html_content:
            return False
        
        success_count = 0
        for email in recipients:
            if self.send_email(email, subject, html_content):
                success_count += 1
        
        logger.info(f"Bulk email sent to {success_count}/{len(recipients)} recipients")
        return success_count > 0

# Create email service instance
email_service = EmailService()
