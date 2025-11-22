#!/usr/bin/env python3
"""
Test the exact data the user is trying to register with
"""

import requests

# Reset rate limits
requests.post("http://localhost:8000/api/v1/auth/reset-rate-limit")

# The exact data from the user's screenshot
user_data = {
    "email": "divyanshuiratbore091@gmail.com",
    "username": "Divyanshu",
    "first_name": "Divyanshu",
    "last_name": "Rathore", 
    "phone": "+91 8445003459",
    "password": "SecurePassword123!",  # Assuming a secure password
    "role": "buyer"
}

print("🧪 Testing exact user data from screenshot")
print("=" * 50)
print(f"Email: {user_data['email']}")
print(f"Username: {user_data['username']}")
print(f"Name: {user_data['first_name']} {user_data['last_name']}")
print(f"Phone: {user_data['phone']}")
print(f"Role: {user_data['role']}")

# Test registration
print("\n📝 Testing registration...")
try:
    response = requests.post("http://localhost:8000/api/v1/auth/register", json=user_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ REGISTRATION SUCCESS!")
        data = response.json()
        print(f"User ID: {data['id']}")
        print(f"Created: {data['created_at']}")
        
        # Test login
        print("\n🔐 Testing login...")
        login_response = requests.post("http://localhost:8000/api/v1/auth/login", json={
            "email": user_data['email'],
            "password": user_data['password']
        })
        
        if login_response.status_code == 200:
            print("✅ LOGIN SUCCESS!")
            login_data = login_response.json()
            print(f"Welcome: {login_data['user']['first_name']} {login_data['user']['last_name']}")
        else:
            print(f"❌ Login failed: {login_response.text}")
            
    elif response.status_code == 400:
        error = response.json()
        if "already" in error.get('detail', ''):
            print("⚠️ User already exists - testing login...")
            
            # Test login with existing user
            login_response = requests.post("http://localhost:8000/api/v1/auth/login", json={
                "email": user_data['email'],
                "password": user_data['password']
            })
            
            if login_response.status_code == 200:
                print("✅ EXISTING USER LOGIN SUCCESS!")
            else:
                print(f"❌ Login failed: {login_response.text}")
        else:
            print(f"❌ Registration failed: {error}")
    else:
        print(f"❌ Registration failed: {response.text}")
        
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 50)
print("🎯 FRONTEND ISSUE DIAGNOSIS:")
print("   1. Check browser console for errors")
print("   2. Verify API URL in frontend environment")
print("   3. Check CORS settings")
print("   4. Test with browser dev tools network tab")
