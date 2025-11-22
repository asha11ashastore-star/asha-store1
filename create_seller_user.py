#!/usr/bin/env python3
"""
Create the seller user in the database
"""

import requests
import json

API_BASE = "http://localhost:8000"

def create_seller_user():
    print("👤 Creating Seller User: Asha Dhaundiyal\n")
    print("=" * 50)
    
    # First, reset rate limits
    print("1️⃣ Resetting rate limits...")
    try:
        reset_response = requests.post(f"{API_BASE}/api/v1/auth/reset-rate-limit")
        if reset_response.status_code == 200:
            print("   ✅ Rate limits reset")
        else:
            print(f"   ⚠️ Rate limit reset failed: {reset_response.status_code}")
    except Exception as e:
        print(f"   ❌ Error resetting rate limits: {e}")
    
    # Create user data
    user_data = {
        "email": "asha@ashastore.com",
        "username": "ashastore",
        "first_name": "Asha",
        "last_name": "Dhaundiyal", 
        "password": "AshaStore2024!",
        "role": "seller"
    }
    
    print(f"\n2️⃣ Creating user: {user_data['first_name']} {user_data['last_name']}")
    print(f"   📧 Email: {user_data['email']}")
    print(f"   🎭 Role: {user_data['role']}")
    
    try:
        # Try to register the user
        response = requests.post(f"{API_BASE}/api/v1/auth/register", json=user_data)
        print(f"   Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ User created successfully!")
            print(f"   👤 User ID: {data['user']['id']}")
            print(f"   📧 Email: {data['user']['email']}")
            print(f"   🎭 Role: {data['user']['role']}")
            return True
        elif response.status_code == 400:
            error_data = response.json()
            if "already exists" in error_data.get('detail', ''):
                print(f"   ✅ User already exists!")
                return True
            else:
                print(f"   ❌ Registration failed: {error_data}")
                return False
        else:
            print(f"   ❌ Registration failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error creating user: {e}")
        return False

def test_login():
    print(f"\n3️⃣ Testing login after user creation...")
    
    login_data = {
        "email": "asha@ashastore.com",
        "password": "AshaStore2024!"
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=login_data)
        print(f"   Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Login successful!")
            print(f"   👤 User: {data['user']['full_name']}")
            print(f"   🎭 Role: {data['user']['role']}")
            return True
        else:
            error_data = response.json()
            print(f"   ❌ Login failed: {error_data}")
            return False
            
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return False

if __name__ == "__main__":
    success = create_seller_user()
    if success:
        test_login()
    
    print("\n" + "=" * 50)
    print("🎉 SELLER DASHBOARD SETUP:")
    print("   ✅ User: Asha Dhaundiyal")
    print("   ✅ Email: asha@ashastore.com")
    print("   ✅ Password: AshaStore2024!")
    print("   ✅ Role: seller")
    print("   🔗 Dashboard: http://localhost:3000")
    print("\n   Now try logging into the seller dashboard!")
