#!/usr/bin/env python3
"""
Migrate database to support new saree categories
"""

import sqlite3
import os

DB_PATH = '/Users/divyanshurathore/shopall/backend/shop.db'

def migrate_categories():
    """Update database to support new category enum values"""
    print("🔄 Migrating database for new saree categories...")
    
    try:
        if not os.path.exists(DB_PATH):
            print("❌ Database not found. Please run the backend first to create it.")
            return False
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check current products and their categories
        cursor.execute("SELECT COUNT(*) FROM products")
        product_count = cursor.fetchone()[0]
        
        print(f"📦 Found {product_count} products in database")
        
        if product_count > 0:
            print("📋 Current product categories:")
            cursor.execute("SELECT DISTINCT category FROM products")
            categories = cursor.fetchall()
            for cat in categories:
                print(f"   • {cat[0]}")
        
        # SQLite doesn't support ALTER COLUMN with ENUM directly
        # But since we're using strings, the new values will work automatically
        print("✅ Database migration complete!")
        print("   SQLite will accept the new category values automatically")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Migration error: {e}")
        return False

def restart_backend_reminder():
    """Remind user to restart backend"""
    print("\n🔄 IMPORTANT: RESTART REQUIRED")
    print("=" * 50)
    print("To use the new categories, you need to:")
    print("1. Stop the backend server (Ctrl+C)")
    print("2. Restart it: cd backend && python3 -m uvicorn main:app --reload")
    print("3. The new categories will be available in the seller dashboard")

def main():
    print("🚀 Category Migration for Saree Subcategories\n")
    print("=" * 60)
    print("Adding comprehensive saree categories:")
    print("• ALL SAREES: View All Sarees")
    print("• SHOP BY FABRIC: Cotton, Silk, Linen")
    print("• SHOP BY WEAVE: Kantha, Jamdani, Handloom, Shibori, etc.")
    print("• SHOP BY VARIETY: Handloom Cotton, Tangail Cotton, etc.")
    print("=" * 60)
    
    # Migrate database
    migration_success = migrate_categories()
    
    # Show restart instructions
    restart_backend_reminder()
    
    print("\n" + "=" * 60)
    if migration_success:
        print("🎉 MIGRATION SUCCESSFUL!")
        
        print("\n✅ WHAT'S NEW:")
        print("   • 30+ detailed saree categories in seller dashboard")
        print("   • Organized by Fabric, Weave, and Variety")
        print("   • Customer website navigation updated")
        print("   • Professional categorization system")
        
        print("\n📱 HOW TO USE:")
        print("   1. Restart backend server")
        print("   2. Go to seller dashboard: http://localhost:3000")
        print("   3. Click 'Add Product'")
        print("   4. Select detailed saree categories:")
        print("      • Cotton Saree, Silk Saree, Linen Saree")
        print("      • Kantha Saree, Jamdani Saree, Handloom Saree")
        print("      • Matka Silk Saree, Tussar Silk Saree, etc.")
        print("   5. Add your authentic products with proper categories")
        
        print("\n🌐 CUSTOMER EXPERIENCE:")
        print("   • Detailed saree navigation menu")
        print("   • Filter by fabric, weave, and variety")
        print("   • Professional categorization")
        print("   • Easy product discovery")
        
    else:
        print("❌ MIGRATION FAILED")
        print("   Please check the error messages above")

if __name__ == "__main__":
    main()
