#!/usr/bin/env python3
import requests

# Reset rate limits
requests.post("http://localhost:8000/api/v1/auth/reset-rate-limit")

# Test login
response = requests.post("http://localhost:8000/api/v1/auth/login", json={
    "email": "divyanshuiratbore091@gmail.com",
    "password": "Customer123!"
})

print(f"Status: {response.status_code}")
print(f"Response: {response.text}")

if response.status_code == 200:
    print("✅ LOGIN SUCCESS!")
    data = response.json()
    print(f"User: {data['user']['first_name']} {data['user']['last_name']}")
    print(f"Token: {data['access_token'][:20]}...")
else:
    print("❌ LOGIN FAILED")
