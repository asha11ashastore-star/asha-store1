from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from typing import Dict, Any, List, Optional
from jinja2 import Environment, FileSystemLoader, Template
from app.config import settings
from app.models import User, Order
import logging
import os

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        # Initialize SendGrid if API key is available
        if settings.sendgrid_api_key:
            try:
                self.sg = SendGridAPIClient(api_key=settings.sendgrid_api_key)
                self.from_email = Email(settings.from_email, settings.from_name)
                logger.info("✅ SendGrid email service ENABLED")
            except Exception as e:
                logger.error(f"Failed to initialize SendGrid: {e}")
                self.sg = None
                self.from_email = None
        else:
            logger.warning("⚠️ SendGrid API key not configured - Email service DISABLED")
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
        """Send email using SendGrid"""
        if not self.sg:
            logger.warning(f"Email service not configured - Cannot send to {to_email}")
            return False
        
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=to_email,
                subject=subject,
                html_content=html_content
            )
            
            if plain_content:
                message.plain_text_content = plain_content
            
            response = self.sg.send(message)
            logger.info(f"✅ Email sent to {to_email} - Status: {response.status_code}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to send email to {to_email}: {e}")
            return False
    
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
        reset_url = f"{settings.frontend_url}/auth/reset-password?token={reset_token}"
        user_name = f"{user.first_name} {user.last_name}"
        
        # Simple HTML email template
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #8B4513; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0;">अशा</h1>
                <p style="margin: 5px 0 0 0;">Asha Store</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #8B4513; margin-top: 0;">Reset Your Password</h2>
                
                <p>Hello {user_name},</p>
                
                <p>We received a request to reset your password for your Asha Store account. Click the button below to create a new password:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}" style="background-color: #8B4513; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="background-color: #e9e9e9; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">
                    {reset_url}
                </p>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    <strong>⚠️ This link will expire in 1 hour.</strong>
                </p>
                
                <p style="color: #666; font-size: 14px;">
                    If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.
                </p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                
                <p style="font-size: 12px; color: #999; text-align: center;">
                    © 2024 Asha Store. Grace Woven by Asha Dhaundiyal<br>
                    Need help? Email us at {settings.from_email}
                </p>
            </div>
        </body>
        </html>
        """
        
        # Add plain text version to improve deliverability
        plain_content = f"""
Hello {user_name},

We received a request to reset your password for your Asha Store account.

Reset your password by clicking this link:
{reset_url}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

---
© 2024 Asha Store. Grace Woven by Asha Dhaundiyal
Need help? Email us at {settings.from_email}
        """
        
        return self.send_email(
            to_email=user.email,
            subject="Reset Your Password - Asha Store",
            html_content=html_content,
            plain_content=plain_content
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
