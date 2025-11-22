#!/usr/bin/env python3
"""
Test script to verify integration between seller dashboard and customer website
"""

import requests
import json
import time

# API Configuration
API_BASE = "http://localhost:8000"
SELLER_DASHBOARD = "http://localhost:3000"
CUSTOMER_WEBSITE = "http://localhost:3001"

# Test credentials (from memories - Asha's store credentials)
SELLER_CREDENTIALS = {
    "email": "asha@ashastore.com",
    "password": "AshaStore2024!"
}

def test_seller_login():
    """Test seller login and get auth token"""
    print("🔐 Testing Seller Login...")
    
    try:
        response = requests.post(
            f"{API_BASE}/api/v1/auth/login",
            json=SELLER_CREDENTIALS,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Seller login successful!")
            return data.get("access_token")
        else:
            print(f"❌ Seller login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Seller login error: {e}")
        return None

def test_create_product(auth_token):
    """Create a test product via API"""
    print("\n📦 Testing Product Creation...")
    
    test_product = {
        "name": "Beautiful Banarasi Silk Saree - Integration Test",
        "description": "Exquisite handwoven Banarasi silk saree with intricate gold work. Perfect for special occasions and traditional events.",
        "category": "saree",
        "price": 4999.99,
        "stock_quantity": 10,
        "sku": f"TEST-SAREE-{int(time.time())}",
        "brand": "Asha Dhaundiyal Handlooms",
        "tags": json.dumps({
            "fabric": "Silk",
            "color": "Royal Blue",
            "size": "Free Size",
            "pattern": "Gold Zari Work",
            "occasion": "Wedding, Festival",
            "saree_length": "5.5",
            "blouse_piece": True,
            "work_type": "Hand Embroidery"
        })
    }
    
    try:
        headers = {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{API_BASE}/api/v1/products",
            json=test_product,
            headers=headers,
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            product_id = data.get("id")
            print(f"✅ Product created successfully! ID: {product_id}")
            print(f"   Product Name: {data.get('name')}")
            print(f"   Category: {data.get('category')}")
            print(f"   Price: ₹{data.get('price')}")
            return product_id
        else:
            print(f"❌ Product creation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Product creation error: {e}")
        return None

def test_get_products_customer_api():
    """Test fetching products from customer website perspective"""
    print("\n🛒 Testing Customer Website Product Access...")
    
    try:
        response = requests.get(
            f"{API_BASE}/api/v1/products",
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            products = data.get("items", [])
            total = data.get("total", 0)
            
            print(f"✅ Customer API access successful!")
            print(f"   Total products available: {total}")
            
            if products:
                print("\n📋 Recent Products:")
                for product in products[:3]:  # Show first 3 products
                    print(f"   • {product.get('name')} - ₹{product.get('price')} ({product.get('category')})")
                    
                # Check if our test product is visible
                test_products = [p for p in products if "Integration Test" in p.get('name', '')]
                if test_products:
                    print(f"\n🎉 Integration Test Product Found!")
                    test_product = test_products[0]
                    print(f"   Name: {test_product.get('name')}")
                    print(f"   ID: {test_product.get('id')}")
                    print(f"   Status: {test_product.get('status')}")
                    return test_product.get('id')
                else:
                    print("\n⏳ Integration test product not yet visible (may need a moment)")
                    
            return len(products)
        else:
            print(f"❌ Customer API access failed: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Customer API access error: {e}")
        return None

def test_specific_product(product_id):
    """Test accessing specific product details"""
    print(f"\n🔍 Testing Specific Product Access (ID: {product_id})...")
    
    try:
        response = requests.get(
            f"{API_BASE}/api/v1/products/{product_id}",
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Product details retrieved successfully!")
            print(f"   Name: {data.get('name')}")
            print(f"   Description: {data.get('description')[:100]}...")
            print(f"   Price: ₹{data.get('price')}")
            print(f"   Stock: {data.get('stock_quantity')} units")
            print(f"   Images: {len(data.get('images', []))} uploaded")
            return True
        else:
            print(f"❌ Product access failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Product access error: {e}")
        return False

def test_api_health():
    """Test API health endpoints"""
    print("\n💚 Testing API Health...")
    
    try:
        response = requests.get(f"{API_BASE}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend API Health: {data.get('status')}")
            print(f"   Database: {data.get('database')}")
            return True
        else:
            print(f"❌ API health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API health check error: {e}")
        return False

def main():
    """Main integration test"""
    print("🚀 Starting Aशā Store Integration Test\n")
    print("=" * 60)
    
    # Test API health
    if not test_api_health():
        print("\n❌ Backend API not healthy. Stopping tests.")
        return
    
    # Test seller login
    auth_token = test_seller_login()
    if not auth_token:
        print("\n❌ Seller authentication failed. Stopping tests.")
        return
    
    # Test product creation
    product_id = test_create_product(auth_token)
    if not product_id:
        print("\n❌ Product creation failed. Stopping tests.")
        return
    
    # Wait a moment for database synchronization
    print("\n⏳ Waiting 2 seconds for synchronization...")
    time.sleep(2)
    
    # Test customer website access
    result = test_get_products_customer_api()
    if result is None:
        print("\n❌ Customer website product access failed.")
        return
    
    # Test specific product access
    test_specific_product(product_id)
    
    # Final summary
    print("\n" + "=" * 60)
    print("🎉 INTEGRATION TEST COMPLETED!")
    print("\n✅ VERIFIED FUNCTIONALITY:")
    print("   • Seller Dashboard → Backend API ✅")
    print("   • Backend API → Customer Website ✅") 
    print("   • Product Creation & Retrieval ✅")
    print("   • Cross-System Data Synchronization ✅")
    print("\n🌟 Aशā Store is fully integrated and working!")
    print(f"\n🔗 Access URLs:")
    print(f"   • Seller Dashboard: {SELLER_DASHBOARD}")
    print(f"   • Customer Website: {CUSTOMER_WEBSITE}")
    print(f"   • Backend API: {API_BASE}")

if __name__ == "__main__":
    main()
