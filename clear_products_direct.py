#!/usr/bin/env python3
"""
Directly clear all products from database using SQLAlchemy
"""

import sys
import os

# Add the backend directory to Python path
sys.path.append('/Users/divyanshurathore/shopall/backend')

from app.database import get_db
from app.models import Product, ProductImage

def clear_all_products():
    """Remove all products and images directly from database"""
    print("🗑️ Clearing all fake products from database...")
    
    try:
        # Get database session
        db = next(get_db())
        
        # Get all products
        products = db.query(Product).all()
        print(f"📦 Found {len(products)} products to remove:")
        
        for product in products:
            print(f"   🗑️ {product.name} (₹{product.price})")
        
        if products:
            # Delete all product images first
            images_deleted = db.query(ProductImage).delete()
            print(f"\n🖼️ Deleted {images_deleted} product images")
            
            # Delete all products
            products_deleted = db.query(Product).delete()
            print(f"📦 Deleted {products_deleted} products")
            
            # Commit the changes
            db.commit()
            print("✅ Database cleared successfully!")
        else:
            print("✅ No products found - database is already clean!")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Error clearing database: {e}")
        return False

def main():
    print("🚀 Direct Database Cleanup\n")
    print("=" * 50)
    
    success = clear_all_products()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 FAKE PRODUCTS REMOVED!")
        print("\n✅ DATABASE NOW READY FOR:")
        print("   • Real product entries")
        print("   • Professional product catalog")
        print("   • Authentic inventory")
        
        print("\n📱 NEXT STEPS:")
        print("   1. Go to: http://localhost:3000")
        print("   2. Login: asha@ashastore.com / AshaStore2024!")
        print("   3. Click 'Add Product'")
        print("   4. Add your first REAL product!")
        
        print("\n🌐 Clean customer website: http://localhost:3001")
        
    else:
        print("❌ Database cleanup failed")

if __name__ == "__main__":
    main()
