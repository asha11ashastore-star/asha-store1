#!/usr/bin/env python3
"""
Remove fake products from database and prepare for real products
"""

import sqlite3
import os

DB_PATH = '/Users/divyanshurathore/shopall/backend/shop.db'

def clear_fake_products():
    """Remove all fake/test products from database"""
    print("🗑️ Clearing fake products from database...")
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Show current products
        cursor.execute("SELECT id, name, price, category, status FROM products")
        products = cursor.fetchall()
        
        print(f"\n📊 Current products in database ({len(products)} total):")
        print("-" * 70)
        for product in products:
            print(f"ID: {product[0]:2} | {product[1][:30]:30} | ₹{product[2]:8.2f} | {product[3]:10} | {product[4]}")
        
        if products:
            # Clear all products
            cursor.execute("DELETE FROM products")
            deleted_count = cursor.rowcount
            
            # Clear product images
            cursor.execute("DELETE FROM product_images") 
            images_deleted = cursor.rowcount
            
            # Reset auto-increment counter
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='products'")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='product_images'")
            
            conn.commit()
            
            print(f"\n✅ Successfully removed:")
            print(f"   📦 {deleted_count} fake products")
            print(f"   🖼️  {images_deleted} product images")
            print("   🔄 Reset ID counters")
            
        else:
            print("\n✅ No products found - database is already clean!")
            
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error clearing products: {e}")
        return False

def check_seller_dashboard_status():
    """Check if seller dashboard is ready for adding products"""
    print("\n🔍 Checking seller dashboard status...")
    
    # Check if seller account exists
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("SELECT email, role FROM users WHERE email = ?", ('asha@ashastore.com',))
        user = cursor.fetchone()
        
        if user:
            print(f"✅ Seller account ready: {user[0]} ({user[1]})")
        else:
            print("❌ Seller account not found!")
            return False
            
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error checking seller account: {e}")
        return False

def main():
    print("🚀 Preparing Database for Real Products\n")
    print("=" * 60)
    
    # Step 1: Clear fake products
    products_cleared = clear_fake_products()
    
    # Step 2: Check seller dashboard
    dashboard_ready = check_seller_dashboard_status()
    
    print("\n" + "=" * 60)
    
    if products_cleared and dashboard_ready:
        print("🎉 DATABASE READY FOR REAL PRODUCTS!")
        
        print("\n📱 HOW TO ADD REAL PRODUCTS:")
        print("   1. Go to: http://localhost:3000")
        print("   2. Login: asha@ashastore.com / AshaStore2024!")
        print("   3. Click 'Add Product' in the dashboard")
        print("   4. Fill in REAL product details:")
        print("      • Product Name (e.g., 'Banarasi Silk Saree')")
        print("      • Description (authentic details)")
        print("      • Real Price (₹2000, ₹5000, etc.)")
        print("      • Select proper Category")
        print("      • Upload real product images")
        print("      • Set stock quantity")
        print("   5. Click 'Add Product' to save")
        
        print("\n✅ BENEFITS:")
        print("   • Clean database with no fake products")
        print("   • Real products will appear on customer website")
        print("   • Professional product catalog")
        print("   • Ready for actual sales")
        
        print(f"\n🔗 URLS:")
        print(f"   📱 Seller Dashboard: http://localhost:3000")
        print(f"   🌐 Customer Website: http://localhost:3001")
        
    else:
        print("❌ SETUP INCOMPLETE")
        if not products_cleared:
            print("   • Failed to clear fake products")
        if not dashboard_ready:
            print("   • Seller dashboard not ready")

if __name__ == "__main__":
    main()
