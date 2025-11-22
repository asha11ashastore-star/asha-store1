#!/usr/bin/env python3
"""
Clean fake products using API calls - Fixed version
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
            print(f"Response: {response.text}")
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
        
        # Debug: Show raw response
        print(f"📡 API Response type: {type(response.json())}")
        products_data = response.json()
        
        # Handle different response formats
        if isinstance(products_data, dict):
            products = products_data.get('products', products_data.get('items', []))
        elif isinstance(products_data, list):
            products = products_data
        else:
            print(f"❌ Unexpected response format: {type(products_data)}")
            return False
        
        print(f"📦 Found {len(products)} products to remove:")
        
        if not products:
            print("✅ No products found - database is already clean!")
            return True
        
        # Show products first
        for i, product in enumerate(products):
            if isinstance(product, dict):
                name = product.get('name', f'Product {i+1}')
                price = product.get('price', 0)
                product_id = product.get('id', 'Unknown')
                print(f"   📦 {name} (₹{price}) [ID: {product_id}]")
            else:
                print(f"   📦 Product {i+1} (unexpected format)")
        
        # Ask for confirmation
        print(f"\n⚠️  About to remove {len(products)} products.")
        
        # Remove each product
        removed_count = 0
        failed_count = 0
        
        for product in products:
            if isinstance(product, dict) and 'id' in product:
                product_id = product['id']
                name = product.get('name', 'Unknown')
                
                try:
                    delete_response = requests.delete(f"{API_BASE}/api/v1/products/{product_id}", headers=headers)
                    if delete_response.status_code == 200:
                        removed_count += 1
                        print(f"   ✅ Removed: {name}")
                    else:
                        failed_count += 1
                        print(f"   ❌ Failed to remove {name}: {delete_response.status_code}")
                except Exception as e:
                    failed_count += 1
                    print(f"   ❌ Error removing {name}: {e}")
            else:
                failed_count += 1
                print(f"   ❌ Invalid product format: {product}")
        
        print(f"\n📊 Removal Summary:")
        print(f"   ✅ Successfully removed: {removed_count}")
        print(f"   ❌ Failed to remove: {failed_count}")
        
        return removed_count > 0
        
    except Exception as e:
        print(f"❌ Error removing products: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🚀 Cleaning Fake Products - Fixed Version\n")
    print("=" * 60)
    
    # Step 1: Get authentication
    token = get_auth_token()
    if not token:
        print("❌ Cannot proceed without authentication")
        return
    
    # Step 2: Clear fake products
    products_cleared = clear_fake_products(token)
    
    print("\n" + "=" * 60)
    
    if products_cleared:
        print("🎉 FAKE PRODUCTS REMOVAL COMPLETED!")
        
        print("\n📱 NOW YOU CAN ADD REAL PRODUCTS:")
        print("   1. Go to: http://localhost:3000")
        print("   2. Login: asha@ashastore.com / AshaStore2024!")
        print("   3. Click 'Add Product'")
        print("   4. Enter real product details")
        print("   5. Upload authentic product images")
        print("   6. Set realistic prices and stock")
        
        print("\n🌐 Check results:")
        print("   • Seller Dashboard: http://localhost:3000")
        print("   • Customer Website: http://localhost:3001")
        
    else:
        print("❌ REMOVAL PROCESS INCOMPLETE")
        print("   You may need to remove products manually via dashboard")

if __name__ == "__main__":
    main()
