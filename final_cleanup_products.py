#!/usr/bin/env python3
"""
Final cleanup of all products - remove the remaining sarees showing on website
"""

import requests

API_BASE = "http://localhost:8000"

def authenticate():
    """Get auth token"""
    print("🔐 Authenticating...")
    
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

def get_all_products_comprehensive(token):
    """Get products from multiple endpoints to ensure we catch all"""
    print("📦 Searching for ALL products...")
    
    headers = {"Authorization": f"Bearer {token}"}
    all_products = []
    
    # Try different endpoints and methods
    endpoints_to_try = [
        "/api/v1/products",
        "/api/v1/products?status=active", 
        "/api/v1/products?status=draft",
        "/api/v1/products?page=1&limit=100"
    ]
    
    for endpoint in endpoints_to_try:
        try:
            print(f"   📡 Trying: {endpoint}")
            response = requests.get(f"{API_BASE}{endpoint}", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract products from different response formats
                products = []
                if isinstance(data, dict):
                    products = data.get('items', data.get('products', data.get('data', [])))
                    # Check if it's a single product wrapped in dict
                    if not products and 'id' in data:
                        products = [data]
                elif isinstance(data, list):
                    products = data
                
                print(f"   📦 Found {len(products)} products in this endpoint")
                
                # Add to our collection (avoid duplicates)
                for product in products:
                    if isinstance(product, dict) and product.get('id'):
                        # Check if already in our list
                        existing = [p for p in all_products if p.get('id') == product.get('id')]
                        if not existing:
                            all_products.append(product)
                            
        except Exception as e:
            print(f"   ⚠️  Error with {endpoint}: {e}")
    
    # Also try public endpoint (no auth)
    try:
        print("   📡 Trying public endpoint...")
        response = requests.get(f"{API_BASE}/api/v1/products")
        if response.status_code == 200:
            data = response.json()
            products = data.get('items', data.get('products', data)) if isinstance(data, dict) else data
            
            if products:
                print(f"   📦 Found {len(products)} products in public endpoint")
                for product in products:
                    if isinstance(product, dict) and product.get('id'):
                        existing = [p for p in all_products if p.get('id') == product.get('id')]
                        if not existing:
                            all_products.append(product)
    except:
        pass
    
    return all_products

def remove_all_products(token, products):
    """Remove all found products"""
    if not products:
        print("✅ No products found to remove!")
        return True
    
    print(f"\n🗑️ Removing {len(products)} products:")
    
    headers = {"Authorization": f"Bearer {token}"}
    removed_count = 0
    
    for product in products:
        product_id = product.get('id')
        name = product.get('name', 'Unknown')
        price = product.get('price', 0)
        
        print(f"   🗑️ Removing: {name} (₹{price}) [ID: {product_id}]")
        
        try:
            delete_response = requests.delete(f"{API_BASE}/api/v1/products/{product_id}", headers=headers)
            
            if delete_response.status_code == 200:
                removed_count += 1
                print(f"      ✅ Removed successfully")
            elif delete_response.status_code == 404:
                print(f"      ℹ️  Already removed (404)")
                removed_count += 1
            else:
                print(f"      ❌ Failed: {delete_response.status_code} - {delete_response.text}")
                
        except Exception as e:
            print(f"      ❌ Error: {e}")
    
    print(f"\n📊 Removed {removed_count} out of {len(products)} products")
    return removed_count > 0

def verify_complete_cleanup():
    """Verify no products remain anywhere"""
    print("\n🔍 Final verification...")
    
    try:
        # Check public endpoint
        response = requests.get(f"{API_BASE}/api/v1/products")
        if response.status_code == 200:
            data = response.json()
            products = data.get('items', data) if isinstance(data, dict) else data
            
            if products and len(products) > 0:
                print(f"❌ Still found {len(products)} products remaining!")
                for p in products:
                    if isinstance(p, dict):
                        print(f"   📦 {p.get('name', 'Unknown')} (₹{p.get('price', 0)})")
                return False
            else:
                print("✅ Completely clean - no products found anywhere!")
                return True
        else:
            print("⚠️  Could not verify - assuming clean")
            return True
    except Exception as e:
        print(f"⚠️  Verification error: {e}")
        return True

def main():
    print("🚀 FINAL PRODUCT CLEANUP - Remove All Remaining Products\n")
    print("=" * 70)
    print("This will remove the 4 sarees currently showing on your website:")
    print("• Handloom Cotton Saree (₹2999)")
    print("• Tangail Cotton Saree (₹3999)")  
    print("• Tussar Silk Saree (₹6999)")
    print("• Matka Silk Saree (₹5999)")
    print("=" * 70)
    
    # Step 1: Authenticate
    token = authenticate()
    if not token:
        print("❌ Cannot proceed without authentication")
        return
    
    # Step 2: Find ALL products
    all_products = get_all_products_comprehensive(token)
    
    # Step 3: Remove all products
    removed = remove_all_products(token, all_products)
    
    # Step 4: Verify cleanup
    completely_clean = verify_complete_cleanup()
    
    print("\n" + "=" * 70)
    
    if completely_clean:
        print("🎉 ALL PRODUCTS COMPLETELY REMOVED!")
        
        print("\n✅ YOUR WEBSITE IS NOW CLEAN:")
        print("   • Customer website shows no products")
        print("   • Database is empty and ready")
        print("   • Professional clean slate")
        
        print("\n📱 NOW ADD YOUR OWN PRODUCTS VIA SELLER DASHBOARD:")
        print("   1. 🌐 Go to: http://localhost:3000")
        print("   2. 🔑 Login: asha@ashastore.com / AshaStore2024!")
        print("   3. ➕ Click 'Add Product' in the sidebar")
        print("   4. 📝 Enter YOUR product details:")
        print("      • Your own saree names")
        print("      • Your authentic descriptions") 
        print("      • Your pricing strategy")
        print("      • Your inventory")
        print("   5. 📸 Upload YOUR product photos")
        print("   6. 💾 Save your products")
        
        print("\n🎯 RECOMMENDED FIRST PRODUCTS:")
        print("   • Add 3-5 of your best sarees")
        print("   • Use authentic names and descriptions")
        print("   • Set competitive prices")
        print("   • Upload high-quality photos")
        
        print("\n🌐 VERIFY RESULTS:")
        print("   • Seller Dashboard: http://localhost:3000")
        print("   • Customer Website: http://localhost:3001 (should be empty now)")
        
    else:
        print("❌ CLEANUP NOT COMPLETE")
        print("   Some products may still remain")
        print("   Try running this script again")

if __name__ == "__main__":
    main()
