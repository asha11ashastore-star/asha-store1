#!/usr/bin/env python3
"""
Add sample products directly to the database
"""
import sys
import os
from decimal import Decimal

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Product, User, UserRole, Category, ProductStatus
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Sample products data for Aशा store
sample_products = [
    {
        "name": "Elegant Banarasi Silk Saree",
        "description": "Beautiful traditional Banarasi silk saree perfect for weddings and special occasions. Handwoven with intricate patterns and gold zari work.",
        "category": Category.CLOTHING,
        "price": Decimal("2999.00"),
        "discounted_price": Decimal("2499.00"),
        "stock_quantity": 15,
        "sku": "ASHA-001",
        "brand": "Aशā",
        "status": ProductStatus.ACTIVE
    },
    {
        "name": "Traditional Cotton Saree",
        "description": "Handwoven cotton saree with traditional block print patterns. Perfect for daily wear and casual occasions.",
        "category": Category.CLOTHING,
        "price": Decimal("1899.00"),
        "discounted_price": Decimal("1599.00"),
        "stock_quantity": 25,
        "sku": "ASHA-002",
        "brand": "Aशā",
        "status": ProductStatus.ACTIVE
    },
    {
        "name": "Designer Kurti Set",
        "description": "Beautiful kurti set with matching dupatta. Comfortable cotton fabric with elegant embroidery work.",
        "category": Category.CLOTHING,
        "price": Decimal("1299.00"),
        "discounted_price": Decimal("999.00"),
        "stock_quantity": 30,
        "sku": "ASHA-003",
        "brand": "Aशā",
        "status": ProductStatus.ACTIVE
    },
    {
        "name": "Embroidered Kurti",
        "description": "Comfortable cotton kurti with beautiful embroidery work. Perfect for casual and formal occasions.",
        "category": Category.CLOTHING,
        "price": Decimal("899.00"),
        "stock_quantity": 20,
        "sku": "ASHA-004",
        "brand": "Aशā",
        "status": ProductStatus.ACTIVE
    },
    {
        "name": "Silk Dupatta",
        "description": "Pure silk dupatta with golden border. Perfect accessory for ethnic wear.",
        "category": Category.CLOTHING,
        "price": Decimal("599.00"),
        "stock_quantity": 40,
        "sku": "ASHA-005",
        "brand": "Aशā",
        "status": ProductStatus.ACTIVE
    },
    {
        "name": "Cotton Stole",
        "description": "Soft cotton stole for everyday wear. Lightweight and comfortable.",
        "category": Category.CLOTHING,
        "price": Decimal("399.00"),
        "stock_quantity": 35,
        "sku": "ASHA-006",
        "brand": "Aशā",
        "status": ProductStatus.ACTIVE
    },
    {
        "name": "Handloom Saree",
        "description": "Traditional handloom saree with authentic weaving patterns. Supporting local artisans.",
        "category": Category.CLOTHING,
        "price": Decimal("2499.00"),
        "stock_quantity": 12,
        "sku": "ASHA-007",
        "brand": "Aशā",
        "status": ProductStatus.ACTIVE
    },
    {
        "name": "Party Wear Kurti",
        "description": "Elegant party wear kurti with sequin work. Perfect for festive occasions.",
        "category": Category.CLOTHING,
        "price": Decimal("1599.00"),
        "stock_quantity": 18,
        "sku": "ASHA-008",
        "brand": "Aशā",
        "status": ProductStatus.ACTIVE
    }
]

def create_seller_user():
    """Create a seller user"""
    db = SessionLocal()
    try:
        # Check if seller already exists
        seller = db.query(User).filter(User.email == "seller@asha.com").first()
        if seller:
            logger.info("Seller user already exists")
            return seller.id
            
        # Create new seller
        seller = User(
            email="seller@asha.com",
            username="asha_dhaundiyal",
            first_name="Asha",
            last_name="Dhaundiyal",
            phone="+919876543210",
            role=UserRole.SELLER,
            is_active=True,
            is_verified=True,
            hashed_password="dummy_hash"  # In real app, this would be properly hashed
        )
        db.add(seller)
        db.commit()
        db.refresh(seller)
        
        logger.info(f"✅ Created seller user: {seller.first_name} {seller.last_name}")
        return seller.id
        
    except Exception as e:
        logger.error(f"Error creating seller: {e}")
        db.rollback()
        return None
    finally:
        db.close()

def add_products():
    """Add sample products to the database"""
    db = SessionLocal()
    try:
        # First create a seller
        seller_id = create_seller_user()
        if not seller_id:
            logger.error("Failed to create seller user")
            return
            
        logger.info("🚀 Adding sample products to Aशā store...")
        
        success_count = 0
        for product_data in sample_products:
            try:
                # Check if product already exists
                existing = db.query(Product).filter(Product.sku == product_data["sku"]).first()
                if existing:
                    logger.info(f"⏭️  Product {product_data['name']} already exists")
                    continue
                
                # Create new product
                product_data["seller_id"] = seller_id
                product = Product(**product_data)
                
                db.add(product)
                db.commit()
                db.refresh(product)
                
                logger.info(f"✅ Added: {product.name}")
                success_count += 1
                
            except Exception as e:
                logger.error(f"❌ Error adding {product_data['name']}: {str(e)}")
                db.rollback()
        
        logger.info(f"\n🎊 Successfully added {success_count}/{len(sample_products)} products to your Aशā store!")
        
        if success_count > 0:
            logger.info(f"\n✅ Your backend now has real products!")
            logger.info(f"🌐 Visit http://localhost:3001 to see them on your website")
            logger.info(f"📊 Visit http://localhost:8000/docs to see API documentation")
            
    except Exception as e:
        logger.error(f"Error adding products: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_products()
