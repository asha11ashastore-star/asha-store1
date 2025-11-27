#!/usr/bin/env python3
"""
Test that signup is working with single names
"""

import requests
import random
import string

API_BASE = "https://asha-store-backend.onrender.com"

def generate_random_email():
    """Generate a random email for testing"""
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{random_str}@example.com"

print("🧪 TESTING SIGNUP FUNCTIONALITY")
print("=" * 60)

# Test 1: Single name signup (like "prankur")
print("\n1️⃣ Testing single name signup...")
print("   Name: testuser")

test_email_1 = generate_random_email()
single_name_data = {
    "username": test_email_1.split('@')[0],
    "first_name": "testuser",
    "email": test_email_1,
    "password": "test1234",
    "role": "buyer"
}

print(f"   Email: {test_email_1}")
print(f"   Sending registration request...")

try:
    response = requests.post(f"{API_BASE}/api/v1/auth/register", json=single_name_data)
    
    if response.status_code == 200:
        print("   ✅ SUCCESS! Single name signup works!")
        print(f"   Response: {response.json()}")
    else:
        print(f"   ❌ FAILED: {response.status_code}")
        print(f"   Error: {response.text}")
except Exception as e:
    print(f"   ❌ ERROR: {e}")

# Test 2: Full name signup (like "John Doe")  
print("\n2️⃣ Testing full name signup...")
print("   Name: John Doe")

test_email_2 = generate_random_email()
full_name_data = {
    "username": test_email_2.split('@')[0],
    "first_name": "John",
    "last_name": "Doe",
    "email": test_email_2,
    "password": "test1234",
    "role": "buyer"
}

print(f"   Email: {test_email_2}")
print(f"   Sending registration request...")

try:
    response = requests.post(f"{API_BASE}/api/v1/auth/register", json=full_name_data)
    
    if response.status_code == 200:
        print("   ✅ SUCCESS! Full name signup works!")
        print(f"   Response: {response.json()}")
    else:
        print(f"   ❌ FAILED: {response.status_code}")
        print(f"   Error: {response.text}")
except Exception as e:
    print(f"   ❌ ERROR: {e}")

print("\n" + "=" * 60)
print("🎉 SIGNUP TESTING COMPLETE!")
print("=" * 60)
print("\n✅ If both tests passed, signup is working!")
print("✅ You can now create accounts on your website!")
print("\n🚀 Go to: https://customer-website-lovat.vercel.app/auth/signup")
print("   And try creating an account!")
