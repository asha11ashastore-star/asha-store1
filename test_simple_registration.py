#!/usr/bin/env python3
import requests
import time

# Reset rate limits
requests.post("http://localhost:8000/api/v1/auth/reset-rate-limit")

# Test registration with shorter password
reg_data = {
    "email": f"newuser{int(time.time())}@test.com",
    "username": f"user{int(time.time())}",
    "first_name": "New", 
    "last_name": "Customer",
    "password": "Pass123!",  # Shorter password
    "role": "buyer"
}

print(f"Testing registration...")
print(f"Email: {reg_data['email']}")

response = requests.post("http://localhost:8000/api/v1/auth/register", json=reg_data)

print(f"Status: {response.status_code}")
print(f"Response: {response.text}")

if response.status_code == 200:
    print("✅ REGISTRATION SUCCESS!")
    
    # Test login with new user
    print("\n🔐 Testing login with new user...")
    login_response = requests.post("http://localhost:8000/api/v1/auth/login", json={
        "email": reg_data['email'],
        "password": reg_data['password']
    })
    
    print(f"Login Status: {login_response.status_code}")
    if login_response.status_code == 200:
        print("✅ NEW USER LOGIN SUCCESS!")
        data = login_response.json()
        print(f"User: {data['user']['first_name']} {data['user']['last_name']}")
    else:
        print("❌ NEW USER LOGIN FAILED")
else:
    print("❌ REGISTRATION FAILED")
