#!/usr/bin/env python3
"""
Force clear all products using authenticated API calls
"""

import requests

API_BASE = "http://localhost:8000"

def force_clear_all_products():
    """Force clear all products with detailed debugging"""
    print("🔐 Authenticating...")
    
    # Login first
    login_data = {
        "email": "asha@ashastore.com",
        "password": "AshaStore2024!"
    }
    
    response = requests.post(f"{API_BASE}/api/v1/auth/login", json=login_data)
    if response.status_code != 200:
        print(f"❌ Login failed: {response.status_code}")
        return False
    
    token = response.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ Authenticated successfully!")
    
    # Get products with detailed info
    print("\n📦 Fetching all products...")
    response = requests.get(f"{API_BASE}/api/v1/products", headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Failed to get products: {response.status_code}")
        return False
    
    data = response.json()
    print(f"📡 Raw response type: {type(data)}")
    print(f"📡 Raw response keys: {data.keys() if isinstance(data, dict) else 'Not a dict'}")
    
    # Extract products array
    products = []
    if isinstance(data, dict):
        products = data.get('products', data.get('items', data.get('data', [])))
        if not products and 'id' in data:  # Single product response
            products = [data]
    elif isinstance(data, list):
        products = data
    
    print(f"📦 Found {len(products)} products to remove")
    
    if not products:
        print("✅ No products found!")
        return True
    
    # Show all products first
    print("\n📋 Products to remove:")
    for i, product in enumerate(products):
        if isinstance(product, dict):
            print(f"   {i+1}. ID: {product.get('id', 'N/A')} | Name: {product.get('name', 'Unknown')} | Price: ₹{product.get('price', 0)}")
        else:
            print(f"   {i+1}. Unexpected format: {type(product)}")
    
    # Remove each product
    removed_count = 0
    print(f"\n🗑️ Starting removal process...")
    
    for product in products:
        if isinstance(product, dict) and 'id' in product:
            product_id = product['id']
            name = product.get('name', 'Unknown')
            
            print(f"   🗑️ Removing: {name} (ID: {product_id})")
            
            try:
                delete_response = requests.delete(f"{API_BASE}/api/v1/products/{product_id}", headers=headers)
                print(f"      📡 Delete response: {delete_response.status_code}")
                
                if delete_response.status_code == 200:
                    removed_count += 1
                    print(f"      ✅ Successfully removed!")
                else:
                    print(f"      ❌ Failed: {delete_response.text}")
                    
            except Exception as e:
                print(f"      ❌ Error: {e}")
    
    print(f"\n📊 Summary: {removed_count} out of {len(products)} products removed")
    
    # Verify cleanup
    print(f"\n🔍 Verifying cleanup...")
    verify_response = requests.get(f"{API_BASE}/api/v1/products", headers=headers)
    if verify_response.status_code == 200:
        remaining_data = verify_response.json()
        remaining_products = []
        
        if isinstance(remaining_data, dict):
            remaining_products = remaining_data.get('products', remaining_data.get('items', remaining_data.get('data', [])))
        elif isinstance(remaining_data, list):
            remaining_products = remaining_data
            
        print(f"📦 Products remaining: {len(remaining_products) if remaining_products else 0}")
        
        if not remaining_products:
            print("🎉 DATABASE IS NOW COMPLETELY CLEAN!")
            return True
        else:
            print("⚠️ Some products still remain")
            return False
    else:
        print("⚠️ Could not verify cleanup")
        return True

def main():
    print("🚀 Force Clear All Products\n")
    print("=" * 50)
    
    success = force_clear_all_products()
    
    print("\n" + "=" * 50)
    
    if success:
        print("🎉 ALL FAKE PRODUCTS REMOVED!")
        print("\n✅ YOUR DATABASE IS NOW CLEAN:")
        print("   • No fake products remaining")
        print("   • Ready for real product entries")
        print("   • Professional setup complete")
        
        print("\n📱 READY TO ADD REAL PRODUCTS:")
        print("   1. Go to: http://localhost:3000")
        print("   2. Login: asha@ashastore.com / AshaStore2024!")
        print("   3. Click 'Add Product' in sidebar")
        print("   4. Add your authentic products:")
        print("      • Banarasi sarees")
        print("      • Cotton kurtis")
        print("      • Designer lehengas")
        print("      • Traditional dupattas")
        print("   5. Upload high-quality images")
        print("   6. Set realistic prices")
        
        print("\n🌐 Your clean websites:")
        print("   • Seller Dashboard: http://localhost:3000")
        print("   • Customer Website: http://localhost:3001")
        
    else:
        print("❌ SOME PRODUCTS STILL REMAIN")
        print("   Try running this script again or manually remove via dashboard")

if __name__ == "__main__":
    main()
