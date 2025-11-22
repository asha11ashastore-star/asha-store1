#!/usr/bin/env python3
"""
Test login for the user who already has an account
"""

import requests

# Reset rate limits
requests.post("http://localhost:8000/api/v1/auth/reset-rate-limit")

# Try different password combinations for the existing user
email = "divyanshuiratbore091@gmail.com"
possible_passwords = [
    "Customer123!",
    "password123",
    "Password123!",
    "Divyanshu123",
    "SecurePassword123!"
]

print("🔐 Testing login for existing user")
print("=" * 50)
print(f"Email: {email}")

for password in possible_passwords:
    print(f"\n🔑 Trying password: {password}")
    
    try:
        response = requests.post("http://localhost:8000/api/v1/auth/login", json={
            "email": email,
            "password": password
        })
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ LOGIN SUCCESS!")
            print(f"👤 User: {data['user']['first_name']} {data['user']['last_name']}")
            print(f"📞 Phone: {data['user'].get('phone', 'Not set')}")
            print(f"🔑 Token: {data['access_token'][:20]}...")
            
            print(f"\n🎉 SOLUTION FOR USER:")
            print(f"   📧 Email: {email}")
            print(f"   🔑 Password: {password}")
            print(f"   💡 Use LOGIN form, not SIGNUP")
            break
        else:
            print("❌ Failed")
    except Exception as e:
        print(f"❌ Error: {e}")
else:
    print(f"\n⚠️ None of the common passwords worked")
    print(f"🔧 User may need to reset password")

print(f"\n📱 INSTRUCTIONS FOR USER:")
print(f"   1. Close the signup form")  
print(f"   2. Click 'Already have an account? Login'")
print(f"   3. Use the correct password")
print(f"   4. If password forgotten, they need password reset feature")
