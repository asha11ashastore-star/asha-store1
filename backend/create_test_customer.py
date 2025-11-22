#!/usr/bin/env python3
"""
Script to create a test customer user for login testing
"""
import asyncio
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import User, UserRole, Base
from app.auth import auth_manager
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_test_customer():
    """Create a test customer user"""
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        
        # Create database session
        db = SessionLocal()
        
        try:
            # Check if customer already exists
            existing_customer = db.query(User).filter(User.email == "owner@clothingstore.com").first()
            if existing_customer:
                logger.info("Test customer already exists!")
                return existing_customer
            
            # Create test customer
            password = "test123"  # Very short password to avoid bcrypt issues
            hashed_password = auth_manager.get_password_hash(password)
            
            test_customer = User(
                email="owner@clothingstore.com",
                username="owner_user",
                first_name="Test",
                last_name="Customer",
                phone="+919999999999",
                hashed_password=hashed_password,
                role=UserRole.BUYER,
                is_active=True,
                is_verified=True
            )
            
            db.add(test_customer)
            db.commit()
            db.refresh(test_customer)
            
            logger.info(f"Test customer created successfully: {test_customer.email}")
            logger.info(f"Login credentials: {test_customer.email} / {password}")
            
            return test_customer
            
        except Exception as e:
            logger.error(f"Error creating test customer: {e}")
            db.rollback()
            raise
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Database error: {e}")
        raise

if __name__ == "__main__":
    create_test_customer()
