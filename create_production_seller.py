#!/usr/bin/env python3
"""
Create seller user on PRODUCTION backend
"""

import requests
import json

# PRODUCTION BACKEND
API_BASE = "https://asha-store-backend.onrender.com"

def create_production_seller():
    print("👤 Creating PRODUCTION Seller User\n")
    print("=" * 60)
    print(f"🌐 Backend: {API_BASE}")
    print("=" * 60)
    
    # User data
    user_data = {
        "email": "asha@ashastore.com",
        "username": "ashastore",
        "first_name": "Asha",
        "last_name": "Dhaundiyal", 
        "password": "AshaStore2024!",
        "role": "seller"
    }
    
    print(f"\n📝 Creating user:")
    print(f"   👤 Name: {user_data['first_name']} {user_data['last_name']}")
    print(f"   📧 Email: {user_data['email']}")
    print(f"   🎭 Role: {user_data['role']}")
    print(f"   🔑 Password: {user_data['password']}")
    
    try:
        print(f"\n🚀 Sending request to: {API_BASE}/api/v1/auth/register")
        response = requests.post(
            f"{API_BASE}/api/v1/auth/register", 
            json=user_data,
            timeout=30
        )
        
        print(f"   📡 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n   ✅ SUCCESS! User created on production!")
            print(f"   👤 User ID: {data.get('user', {}).get('id', 'N/A')}")
            print(f"   📧 Email: {data.get('user', {}).get('email', 'N/A')}")
            print(f"   🎭 Role: {data.get('user', {}).get('role', 'N/A')}")
            return True
            
        elif response.status_code == 400:
            error_data = response.json()
            if "already exists" in str(error_data.get('detail', '')):
                print(f"\n   ℹ️  User already exists on production!")
                return True
            else:
                print(f"\n   ❌ Error: {error_data}")
                return False
        else:
            print(f"\n   ❌ Failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n   ❌ Error: {e}")
        return False

def test_production_login():
    print(f"\n🔐 Testing login on production...")
    
    login_data = {
        "email": "asha@ashastore.com",
        "password": "AshaStore2024!"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/api/v1/auth/login", 
            json=login_data,
            timeout=30
        )
        
        print(f"   📡 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n   ✅ LOGIN SUCCESSFUL!")
            print(f"   👤 User: {data.get('user', {}).get('full_name', 'N/A')}")
            print(f"   🎭 Role: {data.get('user', {}).get('role', 'N/A')}")
            print(f"   🎟️  Token: {data.get('access_token', 'N/A')[:20]}...")
            return True
        else:
            print(f"\n   ❌ Login failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n   ❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("\n🎯 PRODUCTION USER SETUP")
    print("=" * 60)
    
    success = create_production_seller()
    
    if success:
        test_production_login()
    
    print("\n" + "=" * 60)
    print("✅ PRODUCTION SELLER CREDENTIALS:")
    print("=" * 60)
    print("   📧 Email: asha@ashastore.com")
    print("   🔑 Password: AshaStore2024!")
    print("   🎭 Role: seller")
    print("   🌐 Backend: https://asha-store-backend.onrender.com")
    print("   🖥️  Dashboard: https://react-dashboard-gwz6vra1a-ashastore.vercel.app")
    print("=" * 60)
    print("\n🚀 Now login to your seller dashboard with these credentials!")
    print("=" * 60)
