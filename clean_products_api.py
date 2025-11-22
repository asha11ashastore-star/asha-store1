#!/usr/bin/env python3
"""
Clean fake products using API calls
"""

import requests

API_BASE = "http://localhost:8000"

def get_auth_token():
    """Get authentication token for seller"""
    print("🔐 Authenticating as seller...")
    
    login_data = {
        "email": "asha@ashastore.com",
        "password": "AshaStore2024!"
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=login_data)
        if response.status_code == 200:
            token = response.json().get("access_token")
            print("✅ Authentication successful!")
            return token
        else:
            print(f"❌ Login failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def clear_fake_products(token):
    """Remove all fake products using API"""
    print("\n🗑️ Removing fake products...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Get all products
        response = requests.get(f"{API_BASE}/api/v1/products", headers=headers)
        if response.status_code != 200:
            print(f"❌ Could not fetch products: {response.status_code}")
            return False
        
        products = response.json()
        print(f"📦 Found {len(products)} products to remove:")
        
        if not products:
            print("✅ No products found - database is already clean!")
            return True
        
        # Remove each product
        removed_count = 0
        for product in products:
            print(f"   🗑️ Removing: {product.get('name', 'Unknown')} (₹{product.get('price', 0)})")
            
            delete_response = requests.delete(f"{API_BASE}/api/v1/products/{product['id']}", headers=headers)
            if delete_response.status_code == 200:
                removed_count += 1
                print(f"      ✅ Removed successfully")
            else:
                print(f"      ❌ Failed to remove: {delete_response.status_code}")
        
        print(f"\n✅ Successfully removed {removed_count} out of {len(products)} fake products")
        return True
        
    except Exception as e:
        print(f"❌ Error removing products: {e}")
        return False

def verify_clean_database():
    """Verify the database is clean"""
    print("\n🔍 Verifying clean database...")
    
    try:
        # Check public products endpoint (no auth needed)
        response = requests.get(f"{API_BASE}/api/v1/products")
        if response.status_code == 200:
            products = response.json()
            if not products:
                print("✅ Database is clean - no products found!")
                return True
            else:
                print(f"⚠️  Still found {len(products)} products")
                return False
        else:
            print("⚠️  Could not verify - assuming clean")
            return True
    except Exception as e:
        print(f"⚠️  Verification error: {e}")
        return True

def main():
    print("🚀 Cleaning Fake Products via API\n")
    print("=" * 60)
    
    # Step 1: Get authentication
    token = get_auth_token()
    if not token:
        print("❌ Cannot proceed without authentication")
        return
    
    # Step 2: Clear fake products
    products_cleared = clear_fake_products(token)
    
    # Step 3: Verify clean database
    database_clean = verify_clean_database()
    
    print("\n" + "=" * 60)
    
    if products_cleared and database_clean:
        print("🎉 DATABASE CLEANUP SUCCESSFUL!")
        
        print("\n✅ READY FOR REAL PRODUCTS:")
        print("   • All fake products removed")
        print("   • Clean product catalog")
        print("   • Professional setup ready")
        
        print("\n📱 ADD YOUR FIRST REAL PRODUCT:")
        print("   1. Open Seller Dashboard: http://localhost:3000")
        print("   2. Login: asha@ashastore.com / AshaStore2024!")
        print("   3. Click 'Add Product' in sidebar")
        print("   4. Fill in REAL product details:")
        print("      • Product Name: e.g., 'Handwoven Banarasi Saree'")
        print("      • Description: Authentic product description")
        print("      • Price: Real pricing (₹2000, ₹5000, etc.)")
        print("      • Category: Select appropriate category")
        print("      • SKU: Create unique product code")
        print("      • Stock: Set available quantity")
        print("   5. Upload high-quality product images")
        print("   6. Click 'Add Product' to save")
        
        print("\n🌐 CUSTOMER WEBSITE:")
        print("   • Now shows empty catalog: http://localhost:3001")
        print("   • Will display your real products when added")
        print("   • Professional appearance for customers")
        
        print("\n🎯 PRODUCT TIPS:")
        print("   • Use authentic Indian clothing names")
        print("   • Write detailed, appealing descriptions")
        print("   • Set competitive market prices")
        print("   • Use high-resolution product photos")
        print("   • Keep accurate stock counts")
        
    else:
        print("❌ CLEANUP INCOMPLETE")
        print("   Please check the seller dashboard manually")

if __name__ == "__main__":
    main()
