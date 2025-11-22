#!/usr/bin/env python3
"""
Test registration with simplified data to isolate the issue
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_minimal_registration():
    print("🔬 Testing Minimal Registration Data\n")
    print("=" * 50)
    
    # Reset rate limits
    requests.post(f"{API_BASE}/api/v1/auth/reset-rate-limit")
    
    # Test with minimal required data
    minimal_data = {
        "email": "minimal@test.com",
        "username": "minimal123",
        "first_name": "Test",
        "last_name": "User",
        "password": "Password123!",
        "role": "buyer"
    }
    
    print("1️⃣ Testing minimal registration data...")
    print(f"   Data: {json.dumps(minimal_data, indent=2)}")
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/register", json=minimal_data)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 200:
            print("   ✅ Minimal registration WORKS!")
            return True
        else:
            print("   ❌ Minimal registration failed")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_role_variations():
    print("\n2️⃣ Testing different role values...")
    
    # Reset rate limits
    requests.post(f"{API_BASE}/api/v1/auth/reset-rate-limit")
    
    role_variations = ["buyer", "BUYER", "Buyer"]
    
    for i, role in enumerate(role_variations):
        test_data = {
            "email": f"roletest{i}@test.com",
            "username": f"roletest{i}",
            "first_name": "Role",
            "last_name": f"Test{i}",
            "password": "Password123!",
            "role": role
        }
        
        print(f"   Testing role: '{role}'")
        try:
            response = requests.post(f"{API_BASE}/api/v1/auth/register", json=test_data)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                print(f"   ✅ Role '{role}' works!")
                return True
            elif response.status_code == 422:
                print(f"   ⚠️ Role '{role}' validation error")
            else:
                print(f"   ❌ Role '{role}' failed: {response.text}")
        except Exception as e:
            print(f"   ❌ Role '{role}' error: {e}")
    
    return False

def test_without_optional_fields():
    print("\n3️⃣ Testing without optional fields...")
    
    # Reset rate limits
    requests.post(f"{API_BASE}/api/v1/auth/reset-rate-limit")
    
    # Test without phone field
    no_phone_data = {
        "email": "nophone@test.com",
        "username": "nophone123",
        "first_name": "No",
        "last_name": "Phone",
        "password": "Password123!",
        "role": "buyer"
        # No phone field
    }
    
    print("   Testing without phone field...")
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/register", json=no_phone_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Registration without phone works!")
            return True
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    return False

def check_backend_health():
    print("\n4️⃣ Checking backend health...")
    
    try:
        response = requests.get(f"{API_BASE}/health")
        print(f"   Health Status: {response.status_code}")
        
        if response.status_code == 200:
            health_data = response.json()
            print(f"   Database: {'✅ Connected' if health_data.get('database') == 'connected' else '❌ Disconnected'}")
            print(f"   Status: {health_data.get('status', 'unknown')}")
            return True
        else:
            print(f"   ❌ Health check failed")
    except Exception as e:
        print(f"   ❌ Health check error: {e}")
    
    return False

if __name__ == "__main__":
    print("🔍 ISOLATING REGISTRATION ISSUES")
    print("=" * 50)
    
    health_ok = check_backend_health()
    if not health_ok:
        print("❌ Backend health check failed - fix backend first")
        exit(1)
    
    success1 = test_minimal_registration()
    success2 = test_role_variations()
    success3 = test_without_optional_fields()
    
    print("\n" + "=" * 50)
    if success1 or success2 or success3:
        print("✅ FOUND WORKING REGISTRATION!")
        print("   Customer authentication should work now")
    else:
        print("❌ ALL REGISTRATION TESTS FAILED")
        print("   Need to check backend database/schema issues")
    
    print("\n🔧 DEBUGGING SUGGESTIONS:")
    print("   1. Check database schema matches models")
    print("   2. Verify UserRole enum values")
    print("   3. Check for database constraints")
    print("   4. Review email service configuration")
    print("   5. Check backend logs for detailed errors")
