#!/usr/bin/env python3
"""
Create seller user via backend API registration
"""

import requests
import json

API_BASE = "http://localhost:8000"

# Seller user data
seller_data = {
    "email": "asha@ashastore.com",
    "username": "asha_dhaundiyal",
    "first_name": "Asha", 
    "last_name": "Dhaundiyal",
    "phone": "+919876543210",
    "password": "AshaStore2024!",
    "role": "seller"
}

def create_seller_user():
    """Create seller user via API registration"""
    print("📝 Creating seller user via API registration...")
    
    try:
        response = requests.post(
            f"{API_BASE}/api/v1/auth/register",
            json=seller_data,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Seller user created successfully!")
            print(f"   User ID: {data.get('id')}")
            print(f"   Email: {data.get('email')}")
            print(f"   Role: {data.get('role')}")
            return True
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False

def test_login():
    """Test login with created user"""
    print("\n🔑 Testing login...")
    
    try:
        response = requests.post(
            f"{API_BASE}/api/v1/auth/login",
            json={
                "email": seller_data["email"],
                "password": seller_data["password"]
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            print(f"   Access token received: {data.get('access_token')[:50]}...")
            return data.get('access_token')
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

if __name__ == "__main__":
    print("🚀 Setting up Asha seller account...\n")
    
    # Create user
    if create_seller_user():
        # Test login
        token = test_login()
        if token:
            print(f"\n🎉 Setup completed successfully!")
            print(f"📧 Email: {seller_data['email']}")
            print(f"🔑 Password: {seller_data['password']}")
            print(f"👤 Role: {seller_data['role']}")
        else:
            print("\n❌ Login test failed")
    else:
        print("\n❌ User creation failed")
