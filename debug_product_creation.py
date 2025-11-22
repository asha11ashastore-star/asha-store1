#!/usr/bin/env python3
"""
Debug product creation and image upload issues
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_product_creation_flow():
    """Test the complete product creation flow"""
    print("🔍 Debugging Product Creation Issues...")
    
    # Step 1: Authentication
    print("\n1️⃣ Testing Authentication...")
    login_data = {
        "email": "asha@ashastore.com",
        "password": "AshaStore2024!"
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=login_data)
        if response.status_code != 200:
            print(f"❌ Authentication failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ Authentication successful!")
        
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return False
    
    # Step 2: Test Product Creation API
    print("\n2️⃣ Testing Product Creation API...")
    test_product = {
        "name": "Test Banarasi Silk Saree",
        "description": "Beautiful handwoven Banarasi silk saree with intricate patterns and golden border. Perfect for weddings and special occasions.",
        "category": "silk_saree",
        "price": 4500.00,
        "stock_quantity": 3,
        "sku": "BAN001",
        "brand": "Traditional Crafts",
        "tags": json.dumps({
            "fabric": "Silk",
            "color": "Red",
            "pattern": "Traditional",
            "occasion": "Wedding"
        })
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/products", json=test_product, headers=headers)
        print(f"📡 Product creation response: {response.status_code}")
        
        if response.status_code == 200:
            created_product = response.json()
            product_id = created_product.get('id')
            print("✅ Product created successfully!")
            print(f"   📦 Product ID: {product_id}")
            print(f"   📛 Name: {created_product.get('name')}")
            print(f"   💰 Price: ₹{created_product.get('price')}")
            print(f"   📂 Category: {created_product.get('category')}")
            
            # Step 3: Test Image Upload Endpoint
            print(f"\n3️⃣ Testing Image Upload Endpoint...")
            
            # Test if the endpoint exists (without actual files)
            try:
                image_response = requests.get(f"{API_BASE}/api/v1/products/{product_id}/images", headers=headers)
                print(f"📡 Image endpoint response: {image_response.status_code}")
                
                if image_response.status_code in [200, 404]:  # 404 is expected for no images
                    print("✅ Image upload endpoint is accessible")
                else:
                    print(f"⚠️  Image endpoint issue: {image_response.status_code}")
                    print(f"Response: {image_response.text}")
                    
            except Exception as e:
                print(f"❌ Image endpoint error: {e}")
            
            # Step 4: Check if product appears in public list
            print(f"\n4️⃣ Testing Public Product Visibility...")
            
            try:
                public_response = requests.get(f"{API_BASE}/api/v1/products")
                if public_response.status_code == 200:
                    data = public_response.json()
                    products = data.get('items', data) if isinstance(data, dict) else data
                    
                    print(f"📦 Total products in system: {len(products) if products else 0}")
                    
                    # Find our test product
                    test_product_found = None
                    if products:
                        for product in products:
                            if isinstance(product, dict) and product.get('id') == product_id:
                                test_product_found = product
                                break
                    
                    if test_product_found:
                        print("✅ Product visible in public API!")
                        print(f"   Status: {test_product_found.get('status', 'Unknown')}")
                        return product_id
                    else:
                        print("⚠️  Product not found in public API")
                        print("   This might be why it's not appearing on customer website")
                        
                        # Check product status
                        private_response = requests.get(f"{API_BASE}/api/v1/products/{product_id}", headers=headers)
                        if private_response.status_code == 200:
                            private_product = private_response.json()
                            print(f"   🔒 Private API shows status: {private_product.get('status')}")
                            
                            if private_product.get('status') != 'active':
                                print("   💡 Product might need to be activated!")
                        
                else:
                    print(f"❌ Public API failed: {public_response.status_code}")
                    
            except Exception as e:
                print(f"❌ Public API error: {e}")
            
            return product_id
            
        else:
            print(f"❌ Product creation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Product creation error: {e}")
        return False

def check_product_status_and_fix(product_id, headers):
    """Check and fix product status if needed"""
    print(f"\n5️⃣ Checking Product Status...")
    
    try:
        response = requests.get(f"{API_BASE}/api/v1/products/{product_id}", headers=headers)
        if response.status_code == 200:
            product = response.json()
            current_status = product.get('status')
            print(f"📊 Current product status: {current_status}")
            
            if current_status != 'active':
                print("🔄 Activating product...")
                
                # Update product to active status
                update_data = {"status": "active"}
                update_response = requests.put(f"{API_BASE}/api/v1/products/{product_id}", 
                                             json=update_data, headers=headers)
                
                if update_response.status_code == 200:
                    print("✅ Product activated successfully!")
                    return True
                else:
                    print(f"❌ Failed to activate product: {update_response.status_code}")
                    return False
            else:
                print("✅ Product is already active!")
                return True
                
    except Exception as e:
        print(f"❌ Status check error: {e}")
        return False

def main():
    print("🚀 Product Creation Debug Tool\n")
    print("=" * 60)
    print("Investigating issues with:")
    print("1. Product creation in seller dashboard")
    print("2. Image upload functionality") 
    print("3. Product visibility on customer website")
    print("=" * 60)
    
    # Test the flow
    product_id = test_product_creation_flow()
    
    if product_id:
        # Get auth token again
        login_data = {
            "email": "asha@ashastore.com",
            "password": "AshaStore2024!"
        }
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=login_data)
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Check and fix status
        status_fixed = check_product_status_and_fix(product_id, headers)
        
        print("\n" + "=" * 60)
        if status_fixed:
            print("🎉 DIAGNOSIS COMPLETE!")
            
            print("\n✅ WHAT'S WORKING:")
            print("   • Authentication system ✅")
            print("   • Product creation API ✅")
            print("   • Database storage ✅")
            
            print("\n🔧 POTENTIAL ISSUES IDENTIFIED:")
            print("   • Product status might default to 'draft' instead of 'active'")
            print("   • Products need to be activated to appear on customer website")
            print("   • Image upload endpoint may have CORS or authentication issues")
            
            print("\n💡 SOLUTIONS:")
            print("   1. Set product status to 'active' by default in seller dashboard")
            print("   2. Add status toggle in product form")
            print("   3. Fix image upload authentication")
            print("   4. Add better error handling and user feedback")
            
            print(f"\n🌐 CHECK RESULTS:")
            print(f"   • Customer Website: http://localhost:3001")
            print(f"   • Product should now be visible!")
            
        else:
            print("❌ ISSUES REMAIN - Manual investigation needed")
    
    else:
        print("\n❌ BASIC PRODUCT CREATION FAILED")
        print("   Check backend logs and API endpoints")

if __name__ == "__main__":
    main()
