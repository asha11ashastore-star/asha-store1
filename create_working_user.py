#!/usr/bin/env python3
"""
Create a working customer user and test the complete flow
"""

import requests
import sqlite3
import hashlib

def create_customer_user():
    print("👤 Creating Customer User for Testing\n")
    print("=" * 50)
    
    # User data
    email = "divyanshuiratbore091@gmail.com"  # The email from the screenshot
    password = "Customer123!"
    
    print(f"📧 Email: {email}")
    print(f"🔑 Password: {password}")
    
    # Clear existing user
    conn = sqlite3.connect('/Users/divyanshurathore/shopall/backend/clothing_store.db')
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM users WHERE email = ?", (email,))
    conn.commit()
    print("🗑️ Cleared existing user")
    
    # Create proper password hash using bcrypt-style (backend expects this)
    from passlib.context import CryptContext
    try:
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        hashed_password = pwd_context.hash(password)
    except:
        # Fallback to SHA256 if bcrypt fails
        sha256_hash = hashlib.sha256(password.encode()).hexdigest()
        hashed_password = f"sha256${sha256_hash}"
    
    print(f"🔐 Hash type: {'bcrypt' if not hashed_password.startswith('sha256') else 'sha256'}")
    
    # Insert user
    cursor.execute("""
    INSERT INTO users (email, username, first_name, last_name, phone, 
                      hashed_password, role, is_active, is_verified, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    """, (
        email,
        'divyanshu091',
        'Divyanshu',
        'Rathore',
        '+91 9876543210',
        hashed_password,
        'buyer',
        1,  # is_active
        1   # is_verified
    ))
    
    conn.commit()
    user_id = cursor.lastrowid
    print(f"✅ User created with ID: {user_id}")
    
    conn.close()
    return email, password

def test_api_endpoints():
    print(f"\n🔍 Testing API Endpoints...")
    
    # Test health
    try:
        health = requests.get("http://localhost:8000/health")
        print(f"Health: {health.status_code} - {'✅' if health.status_code == 200 else '❌'}")
    except:
        print("Health: ❌ Connection failed")
        return False
    
    # Test auth endpoint exists
    try:
        # This should return 422 (missing body) not 404
        auth_test = requests.post("http://localhost:8000/api/v1/auth/login")
        print(f"Auth endpoint: {auth_test.status_code} - {'✅' if auth_test.status_code in [422, 400] else '❌'}")
    except:
        print("Auth endpoint: ❌ Connection failed")
        return False
    
    return True

def test_login_flow(email, password):
    print(f"\n🔐 Testing Login Flow...")
    
    # Reset rate limits
    try:
        requests.post("http://localhost:8000/api/v1/auth/reset-rate-limit")
        print("Rate limits reset ✅")
    except:
        print("Rate limits reset ❌")
    
    # Test login
    login_data = {
        "email": email,
        "password": password
    }
    
    print(f"Login data: {login_data}")
    
    try:
        response = requests.post("http://localhost:8000/api/v1/auth/login", json=login_data)
        print(f"Login response: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ LOGIN SUCCESS!")
            print(f"👤 User: {data.get('user', {}).get('first_name', 'Unknown')}")
            print(f"🔑 Token: {data.get('access_token', 'No token')[:20]}...")
            return True
        else:
            print(f"❌ Login failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

def test_registration():
    print(f"\n📝 Testing Registration...")
    
    # Reset rate limits
    requests.post("http://localhost:8000/api/v1/auth/reset-rate-limit")
    
    # Test registration
    reg_data = {
        "email": "newuser@test.com",
        "username": "newuser123",
        "first_name": "New",
        "last_name": "User",
        "password": "NewUser123!",
        "role": "buyer"
    }
    
    try:
        response = requests.post("http://localhost:8000/api/v1/auth/register", json=reg_data)
        print(f"Registration response: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ REGISTRATION SUCCESS!")
            return True
        else:
            print(f"❌ Registration failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 FIXING CUSTOMER AUTHENTICATION\n")
    
    # Step 1: Test API connectivity
    if not test_api_endpoints():
        print("❌ API connectivity issues - check backend")
        exit(1)
    
    # Step 2: Create test user
    email, password = create_customer_user()
    
    # Step 3: Test login
    login_success = test_login_flow(email, password)
    
    # Step 4: Test registration
    reg_success = test_registration()
    
    print("\n" + "=" * 50)
    print("🎯 CUSTOMER AUTHENTICATION STATUS:")
    print(f"   Login: {'✅ WORKING' if login_success else '❌ FAILED'}")
    print(f"   Registration: {'✅ WORKING' if reg_success else '❌ FAILED'}")
    
    if login_success:
        print(f"\n🎉 SUCCESS! Customer can now login:")
        print(f"   📧 Email: {email}")
        print(f"   🔑 Password: {password}")
        print(f"   🌐 Website: http://localhost:3001")
        print(f"\n💡 The customer in the screenshot can now login successfully!")
    else:
        print(f"\n❌ Still need to fix backend authentication issues")
