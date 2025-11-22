#!/usr/bin/env python3
"""
Test seller authentication directly
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_seller_auth():
    print("🔐 Testing Seller Authentication\n")
    print("=" * 50)
    
    # Test login with Asha's credentials
    login_data = {
        "email": "asha@ashastore.com",
        "password": "AshaStore2024!"
    }
    
    print(f"1️⃣ Attempting login with: {login_data['email']}")
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=login_data)
        print(f"   Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Login Successful!")
            print(f"   👤 User: {data['user']['full_name']}")
            print(f"   📧 Email: {data['user']['email']}")
            print(f"   🎭 Role: {data['user']['role']}")
            print(f"   🔑 Token: {data['access_token'][:50]}...")
            
            # Test token validation
            token = data['access_token']
            headers = {"Authorization": f"Bearer {token}"}
            
            print(f"\n2️⃣ Testing token validation...")
            me_response = requests.get(f"{API_BASE}/api/v1/auth/me", headers=headers)
            print(f"   Response Status: {me_response.status_code}")
            
            if me_response.status_code == 200:
                me_data = me_response.json()
                print(f"   ✅ Token Valid!")
                print(f"   👤 Verified User: {me_data['full_name']}")
                print(f"   🎭 Verified Role: {me_data['role']}")
            else:
                print(f"   ❌ Token validation failed: {me_response.text}")
                
        elif response.status_code == 422:
            print(f"   ❌ Validation Error: {response.json()}")
        elif response.status_code == 401:
            print(f"   ❌ Authentication Failed: {response.json()}")
        else:
            print(f"   ❌ Error: {response.status_code} - {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection Error: Backend not running on port 8000")
    except Exception as e:
        print(f"   ❌ Error: {e}")

def check_user_in_db():
    print(f"\n3️⃣ Checking if user exists in database...")
    
    # Test getting all users (if there's such endpoint)
    try:
        response = requests.get(f"{API_BASE}/health")
        if response.status_code == 200:
            print("   ✅ Backend is healthy")
        else:
            print("   ❌ Backend health check failed")
    except Exception as e:
        print(f"   ❌ Backend connection error: {e}")

if __name__ == "__main__":
    test_seller_auth()
    check_user_in_db()
    
    print("\n" + "=" * 50)
    print("📋 AUTHENTICATION TROUBLESHOOTING:")
    print("   1. Check if backend is running: http://localhost:8000")
    print("   2. Verify user exists in database")
    print("   3. Check if password is correct")
    print("   4. Verify user role is 'SELLER' or 'seller'")
    print("   5. Check JWT token generation")
