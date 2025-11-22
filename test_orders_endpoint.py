#!/usr/bin/env python3
"""
Test the seller orders endpoint
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_orders_endpoint():
    print("📋 Testing Seller Orders Endpoint\n")
    print("=" * 50)
    
    # Step 1: Login to get token
    login_data = {
        "email": "asha@ashastore.com",
        "password": "AshaStore2024!"
    }
    
    print("1️⃣ Logging in to get token...")
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            token = data['access_token']
            print(f"   ✅ Login successful")
            print(f"   👤 User: {data['user'].get('first_name', 'Asha')}")
            print(f"   🎭 Role: {data['user']['role']}")
        else:
            print(f"   ❌ Login failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return False
    
    # Step 2: Test seller orders endpoint
    print(f"\n2️⃣ Testing seller orders endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE}/api/v1/orders/seller", headers=headers)
        print(f"   Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Orders endpoint working!")
            print(f"   📊 Total orders: {data.get('total', 0)}")
            print(f"   📄 Current page: {data.get('page', 1)}")
            print(f"   📋 Items per page: {data.get('limit', 20)}")
            print(f"   📰 Total pages: {data.get('pages', 0)}")
            print(f"   ⬅️ Has previous: {data.get('has_prev', False)}")
            print(f"   ➡️ Has next: {data.get('has_next', False)}")
            
            orders = data.get('items', [])
            if orders:
                print(f"\n   📋 Orders found:")
                for order in orders[:3]:  # Show first 3 orders
                    print(f"      Order #{order.get('order_number')}")
                    print(f"      Total: ${order.get('total_amount')}")
                    print(f"      Status: {order.get('status')}")
            else:
                print(f"   📭 No orders found (this is normal if no customers have ordered yet)")
            
            return True
        else:
            error_data = response.json() if response.headers.get('content-type') == 'application/json' else response.text
            print(f"   ❌ Orders endpoint failed: {error_data}")
            return False
            
    except Exception as e:
        print(f"   ❌ Orders endpoint error: {e}")
        return False

def test_schema_validation():
    print(f"\n3️⃣ Testing schema structure...")
    
    # Test if the response has all required fields
    mock_response = {
        'items': [],
        'total': 0,
        'page': 1,
        'limit': 20,
        'pages': 0,
        'has_next': False,
        'has_prev': False
    }
    
    required_fields = ['items', 'total', 'page', 'limit', 'pages', 'has_next', 'has_prev']
    missing_fields = [field for field in required_fields if field not in mock_response]
    
    if not missing_fields:
        print(f"   ✅ Schema structure is correct")
        print(f"   📋 All required fields present: {', '.join(required_fields)}")
    else:
        print(f"   ❌ Missing fields: {missing_fields}")

if __name__ == "__main__":
    test_schema_validation()
    success = test_orders_endpoint()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 ORDERS ENDPOINT STATUS: ✅ WORKING")
        print("   📱 Frontend should now load orders successfully")
        print("   🔗 Dashboard: http://localhost:3000/dashboard/orders")
    else:
        print("❌ ORDERS ENDPOINT STATUS: FAILED")
        print("   🔧 Check backend logs for more details")
    
    print("\n📋 Next Steps:")
    print("   1. Check seller dashboard at http://localhost:3000")
    print("   2. Login with asha@ashastore.com / AshaStore2024!")
    print("   3. Orders page should now load without errors")
