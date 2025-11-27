#!/usr/bin/env python3
"""
Reset Asha's account by creating a new one with correct SHA256 hash
Since we can't access Render's database directly, we'll use a workaround
"""
import requests
import json
import hashlib

BASE_URL = "https://asha-store-backend.onrender.com"

def check_password_hash():
    """Check what hash format is expected"""
    print("🔍 Checking backend password format...")
    print()
    
    # The backend is using SHA256 hashing (from auth.py line 45-50)
    # Format: sha256$<hash>
    
    password = "AshaStore2024!"
    sha256_hash = hashlib.sha256(password.encode()).hexdigest()
    expected_format = f"sha256${sha256_hash}"
    
    print(f"Expected password format: sha256$<hash>")
    print(f"Password: {password}")
    print(f"SHA256 hash: {sha256_hash}")
    print(f"Full format: {expected_format[:60]}...")
    print()
    
    return password, expected_format

def try_register_new_user():
    """Try to register with a slightly different email to test"""
    print("🔧 Testing registration with test account...")
    
    test_data = {
        "first_name": "Test",
        "last_name": "Seller",
        "username": "testseller",
        "email": "test@ashastore.com",
        "password": "TestPassword123!",
        "role": "seller"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Registration Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print("✅ Test registration successful!")
            print()
            
            # Now try to login with test account
            print("🔐 Testing login with test account...")
            login_response = requests.post(
                f"{BASE_URL}/api/v1/auth/login",
                json={
                    "email": test_data["email"],
                    "password": test_data["password"]
                }
            )
            
            print(f"Login Status: {login_response.status_code}")
            
            if login_response.status_code == 200:
                print("✅ Test login successful!")
                print("Backend hashing is working correctly.")
                print()
                print("This means the issue is with the asha@ashastore.com account specifically.")
                print("Possible causes:")
                print("1. Password was created with bcrypt before SHA256 was implemented")
                print("2. Database session error is from something else")
                return True
            else:
                print(f"❌ Test login failed: {login_response.text}")
                return False
        else:
            data = response.json()
            if "already exists" in data.get("detail", "").lower():
                print("⚠️  Test account already exists, trying login...")
                # Try login
                login_response = requests.post(
                    f"{BASE_URL}/api/v1/auth/login",
                    json={
                        "email": test_data["email"],
                        "password": test_data["password"]
                    }
                )
                if login_response.status_code == 200:
                    print("✅ Test login successful!")
                    return True
            print(f"Registration response: {json.dumps(data, indent=2)}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("="*60)
    print("ASHA ACCOUNT DIAGNOSTIC & RESET TOOL")
    print("="*60)
    print()
    
    # Check hash format
    password, expected_hash = check_password_hash()
    
    # Test with a new account
    test_result = try_register_new_user()
    
    print()
    print("="*60)
    print("RECOMMENDATIONS:")
    print("="*60)
    
    if test_result:
        print()
        print("The backend registration/login system is working.")
        print("The issue is specific to asha@ashastore.com account.")
        print()
        print("SOLUTION:")
        print("We need to directly access Render's database to fix the password hash.")
        print()
        print("OPTIONS:")
        print("1. Use Render Shell to connect to the database")
        print("2. Create a backend API endpoint to reset the password")
        print("3. Delete and recreate the asha@ashastore.com account")
        print()
        print("Let's try option 3 (if the user doesn't exist error)...")
        
        # Try registering asha again with correct format
        print()
        print("🔧 Attempting to register asha@ashastore.com...")
        asha_data = {
            "first_name": "Asha",
            "last_name": "Dhaundiyal",
            "username": "asha_new",  # Different username
            "email": "asha@ashastore.com",
            "password": "AshaStore2024!",
            "role": "seller"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register",
            json=asha_data
        )
        
        if response.status_code in [200, 201]:
            print("✅ Successfully created asha@ashastore.com!")
            print("Try logging in now!")
        else:
            print(f"❌ Could not create: {response.json()}")
    else:
        print()
        print("❌ Backend has fundamental issues with registration/login.")
        print("Check backend logs for more details.")

if __name__ == "__main__":
    main()
