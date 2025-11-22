#!/usr/bin/env python3
"""
Check database directly to see products and their status
"""

import sqlite3
import json
from pathlib import Path

# Database paths
DB_PATHS = [
    "/Users/divyanshurathore/shopall/backend/clothing_store.db",
    "/Users/divyanshurathore/shopall/backend/single_seller_store.db"
]

def check_products():
    """Check products in database"""
    
    for db_path in DB_PATHS:
        if not Path(db_path).exists():
            print(f"Database {db_path} does not exist, skipping...")
            continue
            
        print(f"\n📍 Checking database: {db_path}")
        print("=" * 60)
        
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Check if products table exists
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='products';")
            if not cursor.fetchone():
                print("❌ Products table does not exist")
                continue
            
            # Get all products
            cursor.execute("""
                SELECT id, name, category, price, stock_quantity, sku, status, seller_id 
                FROM products 
                ORDER BY id
            """)
            products = cursor.fetchall()
            
            print(f"📦 Found {len(products)} products:")
            
            for product in products:
                product_id, name, category, price, stock, sku, status, seller_id = product
                print(f"\n  Product ID: {product_id}")
                print(f"  Name: {name}")
                print(f"  Category: {category}")
                print(f"  Price: ₹{price}")
                print(f"  Stock: {stock}")
                print(f"  SKU: {sku}")
                print(f"  Status: {status}")
                print(f"  Seller ID: {seller_id}")
                
                # Check if seller exists
                cursor.execute("SELECT first_name, last_name, email FROM users WHERE id = ?", (seller_id,))
                seller = cursor.fetchone()
                if seller:
                    print(f"  Seller: {seller[0]} {seller[1]} ({seller[2]})")
                else:
                    print(f"  ❌ Seller not found!")
            
            # Check users
            print(f"\n👥 Users in database:")
            cursor.execute("SELECT id, email, role, is_active FROM users")
            users = cursor.fetchall()
            
            for user in users:
                user_id, email, role, is_active = user
                status = "✅ Active" if is_active else "❌ Inactive"
                print(f"  ID: {user_id}, Email: {email}, Role: {role} {status}")
                
        except Exception as e:
            print(f"❌ Error checking {db_path}: {e}")
        finally:
            conn.close()

def fix_product_status():
    """Fix product status to ACTIVE"""
    print(f"\n🔧 Fixing product status to ACTIVE...")
    
    for db_path in DB_PATHS:
        if not Path(db_path).exists():
            continue
            
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Update all products to ACTIVE status
            cursor.execute("UPDATE products SET status = 'ACTIVE' WHERE status != 'ACTIVE'")
            updated_count = cursor.rowcount
            
            if updated_count > 0:
                print(f"✅ Updated {updated_count} products to ACTIVE in {db_path}")
                conn.commit()
            else:
                print(f"ℹ️  No products needed status update in {db_path}")
                
        except Exception as e:
            print(f"❌ Error updating {db_path}: {e}")
        finally:
            conn.close()

if __name__ == "__main__":
    print("🔍 Checking database state...")
    check_products()
    
    print("\n" + "=" * 60)
    fix_product_status()
    
    print("\n🔄 Checking again after fixes...")
    check_products()
