#!/usr/bin/env python3
"""
Test database insert directly to isolate issues
"""

import sqlite3
import hashlib
import sys
import os

# Add the backend directory to Python path
sys.path.append('/Users/divyanshurathore/shopall/backend')

def test_direct_insert():
    print("🔬 Testing Direct Database Insert\n")
    print("=" * 50)
    
    db_path = "/Users/divyanshurathore/shopall/backend/clothing_store.db"
    
    print(f"1️⃣ Database: {db_path}")
    
    # Test user data
    user_data = {
        'email': 'directtest@example.com',
        'username': 'directtest123',
        'first_name': 'Direct',
        'last_name': 'Test',
        'phone': '+91 9999999999',
        'role': 'buyer',
        'is_active': 1,
        'is_verified': 1
    }
    
    # Create password hash
    password = "DirectTest123!"
    sha256_hash = hashlib.sha256(password.encode()).hexdigest()
    hashed_password = f"sha256${sha256_hash}"
    
    print(f"2️⃣ User Data:")
    for key, value in user_data.items():
        print(f"   {key}: {value}")
    print(f"   password: {password}")
    print(f"   hashed_password: {hashed_password[:30]}...")
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT COUNT(*) FROM users WHERE email = ?", (user_data['email'],))
        if cursor.fetchone()[0] > 0:
            print(f"\n⚠️ User already exists, deleting first...")
            cursor.execute("DELETE FROM users WHERE email = ?", (user_data['email'],))
            conn.commit()
        
        # Insert user directly
        insert_sql = """
        INSERT INTO users (email, username, first_name, last_name, phone, 
                          hashed_password, role, is_active, is_verified, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """
        
        cursor.execute(insert_sql, (
            user_data['email'],
            user_data['username'], 
            user_data['first_name'],
            user_data['last_name'],
            user_data['phone'],
            hashed_password,
            user_data['role'],
            user_data['is_active'],
            user_data['is_verified']
        ))
        
        conn.commit()
        user_id = cursor.lastrowid
        
        print(f"\n3️⃣ Direct Insert Results:")
        print(f"   ✅ User inserted successfully!")
        print(f"   👤 User ID: {user_id}")
        
        # Verify insert
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user_record = cursor.fetchone()
        
        if user_record:
            print(f"   ✅ User verified in database")
            print(f"   📧 Email: {user_record[1]}")
            print(f"   👤 Name: {user_record[3]} {user_record[4]}")
            print(f"   🎭 Role: {user_record[6]}")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"\n❌ Direct insert failed: {e}")
        return False

def test_api_with_inserted_user():
    print(f"\n4️⃣ Testing API login with inserted user...")
    
    import requests
    
    login_data = {
        "email": "directtest@example.com",
        "password": "DirectTest123!"
    }
    
    try:
        # Reset rate limits
        requests.post("http://localhost:8000/api/v1/auth/reset-rate-limit")
        
        response = requests.post("http://localhost:8000/api/v1/auth/login", json=login_data)
        print(f"   Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Login successful!")
            print(f"   👤 User: {data['user']['first_name']} {data['user']['last_name']}")
            print(f"   🎭 Role: {data['user']['role']}")
            print(f"   🔑 Token: {data['access_token'][:20]}...")
            return True
        else:
            error_data = response.json()
            print(f"   ❌ Login failed: {error_data}")
            return False
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return False

if __name__ == "__main__":
    success1 = test_direct_insert()
    if success1:
        success2 = test_api_with_inserted_user()
    
    print("\n" + "=" * 50)
    if success1 and success2:
        print("✅ DATABASE AND API WORKING!")
        print("   Issue is in registration endpoint logic")
        print("   Database schema and API auth are fine")
    elif success1:
        print("⚠️ DATABASE OK, API LOGIN ISSUE")
        print("   Direct insert works, API login fails")
    else:
        print("❌ DATABASE INSERT FAILED")
        print("   Fundamental database issue")
    
    print("\n🔧 NEXT STEPS:")
    print("   1. Check auth.py registration endpoint line by line")
    print("   2. Look for password hashing issues")
    print("   3. Check SQLAlchemy model vs schema mismatch")
    print("   4. Review exception handling in registration")
