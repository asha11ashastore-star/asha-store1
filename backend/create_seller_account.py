#!/usr/bin/env python3
"""
Create a proper seller account with hashed password for login
"""
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import get_db
from app.models import User, UserRole
from app.auth import AuthManager
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_seller_account():
    """Create seller account with proper password hashing"""
    
    # Seller credentials
    seller_email = "seller@asha.com"
    seller_password = "Asha2024"  # Strong password for seller
    
    auth_manager = AuthManager()
    
    try:
        db = next(get_db())
        
        # Check if seller already exists
        existing_seller = db.query(User).filter(User.email == seller_email).first()
        
        if existing_seller:
            logger.info(f"Updating existing seller account: {seller_email}")
            # Update with proper hashed password
            existing_seller.hashed_password = auth_manager.get_password_hash(seller_password)
            db.commit()
            seller = existing_seller
        else:
            logger.info(f"Creating new seller account: {seller_email}")
            # Create new seller with proper hashed password
            seller = User(
                email=seller_email,
                username="asha_dhaundiyal",
                first_name="Asha",
                last_name="Dhaundiyal",
                phone="+919876543210",
                role=UserRole.SELLER,
                is_active=True,
                is_verified=True,
                hashed_password=auth_manager.get_password_hash(seller_password)
            )
            db.add(seller)
            db.commit()
        
        logger.info("✅ Seller account created/updated successfully!")
        logger.info(f"📧 Email: {seller_email}")
        logger.info(f"🔑 Password: {seller_password}")
        logger.info(f"👤 Name: {seller.first_name} {seller.last_name}")
        logger.info(f"🏪 Role: {seller.role}")
        
        print("\n" + "="*50)
        print("🎊 SELLER LOGIN CREDENTIALS")
        print("="*50)
        print(f"Email:    {seller_email}")
        print(f"Password: {seller_password}")
        print("="*50)
        print("📱 Use these credentials in the seller dashboard!")
        print("🌐 Dashboard URL: http://localhost:3000")
        
        return True
        
    except Exception as e:
        logger.error(f"Error creating seller account: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = create_seller_account()
    if not success:
        sys.exit(1)
