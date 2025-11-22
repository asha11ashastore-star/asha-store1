"""
Razorpay Payment Link Service for Asha Store
Creates payment links with locked amounts that customers cannot edit
"""

import requests
import base64
from typing import Dict, Any
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class RazorpayPaymentLinkService:
    """Service to create Razorpay payment links with fixed amounts"""
    
    def __init__(self):
        self.key_id = settings.razorpay_key_id
        self.key_secret = settings.razorpay_key_secret
        self.base_url = "https://api.razorpay.com/v1"
        
        # Create basic auth header
        auth_string = f"{self.key_id}:{self.key_secret}"
        self.auth_header = base64.b64encode(auth_string.encode()).decode()
    
    def create_payment_link(
        self,
        amount: float,
        product_name: str,
        customer_name: str = None,
        customer_email: str = None,
        customer_phone: str = None,
        order_id: int = None
    ) -> Dict[str, Any]:
        """
        Create a Razorpay payment link with locked amount
        
        Args:
            amount: Amount in rupees (e.g., 3500 for ₹3,500)
            product_name: Name of the product
            customer_name: Customer's name (optional)
            customer_email: Customer's email (optional)
            customer_phone: Customer's phone (optional)
            order_id: Internal order ID for reference (optional)
        
        Returns:
            dict with payment link URL and details
        """
        try:
            # Convert amount to paise (Razorpay uses paise)
            amount_in_paise = int(amount * 100)
            
            # Prepare payment link data
            payment_link_data = {
                "amount": amount_in_paise,
                "currency": "INR",
                "description": product_name,
                "customer": {},
                "notify": {
                    "sms": True,
                    "email": True
                },
                "reminder_enable": True,
                "options": {
                    "checkout": {
                        "readonly": {
                            "email": False,
                            "contact": False
                        }
                    }
                }
            }
            
            # Add customer details if provided
            if customer_name:
                payment_link_data["customer"]["name"] = customer_name
            if customer_email:
                payment_link_data["customer"]["email"] = customer_email
            if customer_phone:
                payment_link_data["customer"]["contact"] = customer_phone
            
            # Add order reference if provided
            if order_id:
                payment_link_data["reference_id"] = f"order_{order_id}"
                payment_link_data["notes"] = {
                    "order_id": str(order_id),
                    "product": product_name
                }
            
            # Create payment link via API
            response = requests.post(
                f"{self.base_url}/payment_links",
                json=payment_link_data,
                headers={
                    "Authorization": f"Basic {self.auth_header}",
                    "Content-Type": "application/json"
                }
            )
            
            if response.status_code == 200:
                payment_link = response.json()
                logger.info(f"Payment link created: {payment_link['id']}")
                return {
                    "success": True,
                    "payment_link_id": payment_link["id"],
                    "payment_link_url": payment_link["short_url"],
                    "amount": amount,
                    "status": payment_link["status"]
                }
            else:
                logger.error(f"Failed to create payment link: {response.text}")
                return {
                    "success": False,
                    "error": response.text
                }
        
        except Exception as e:
            logger.error(f"Error creating payment link: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def create_simple_payment_url(
        self,
        amount: float,
        product_name: str,
        username: str = "ashadhaundiyal"
    ) -> str:
        """
        Create a simple Razorpay.me payment URL with pre-filled amount
        
        Args:
            amount: Amount in rupees
            product_name: Product name/description
            username: Razorpay username (default: ashadhaundiyal)
        
        Returns:
            Payment URL string
        """
        # URL encode the product name
        import urllib.parse
        encoded_purpose = urllib.parse.quote(product_name)
        
        # Create payment URL with amount and purpose
        payment_url = f"https://razorpay.me/@{username}?amount={int(amount)}&purpose={encoded_purpose}"
        
        return payment_url
    
    def check_payment_status(self, payment_link_id: str) -> Dict[str, Any]:
        """
        Check the status of a payment link
        
        Args:
            payment_link_id: The payment link ID from Razorpay
        
        Returns:
            dict with payment link status
        """
        try:
            response = requests.get(
                f"{self.base_url}/payment_links/{payment_link_id}",
                headers={
                    "Authorization": f"Basic {self.auth_header}"
                }
            )
            
            if response.status_code == 200:
                payment_link = response.json()
                return {
                    "success": True,
                    "status": payment_link["status"],
                    "amount_paid": payment_link.get("amount_paid", 0) / 100,
                    "payments": payment_link.get("payments", [])
                }
            else:
                return {
                    "success": False,
                    "error": response.text
                }
        
        except Exception as e:
            logger.error(f"Error checking payment status: {e}")
            return {
                "success": False,
                "error": str(e)
            }

# Create singleton instance
payment_link_service = RazorpayPaymentLinkService()
