#!/usr/bin/env python3
"""
Reset Asha's password in the database
"""

import sqlite3
import hashlib
from passlib.context import CryptContext
import sys
import os

# Add the backend directory to Python path
sys.path.append('/Users/divyanshurathore/shopall/backend')

def reset_password():
    print("🔐 Resetting Asha's Password\n")
    print("=" * 50)
    
    db_path = "/Users/divyanshurathore/shopall/backend/clothing_store.db"
    email = "asha@ashastore.com"
    new_password = "AshaStore2024!"
    
    # Create SHA256 hash (compatible with backend)
    sha256_hash = hashlib.sha256(new_password.encode()).hexdigest()
    hashed_password = f"sha256${sha256_hash}"
    
    print(f"1️⃣ Database: {db_path}")
    print(f"2️⃣ Email: {email}")
    print(f"3️⃣ New Password: {new_password}")
    print(f"4️⃣ Hash: {hashed_password[:50]}...")
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id, email, role, hashed_password FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        
        if user:
            user_id, user_email, role, old_hash = user
            print(f"\n✅ User found:")
            print(f"   ID: {user_id}")
            print(f"   Email: {user_email}")
            print(f"   Role: {role}")
            print(f"   Old Hash: {old_hash[:50] if old_hash else 'None'}...")
            
            # Update password
            cursor.execute("UPDATE users SET hashed_password = ? WHERE email = ?", (hashed_password, email))
            conn.commit()
            
            print(f"\n✅ Password updated successfully!")
            
            # Verify update
            cursor.execute("SELECT hashed_password FROM users WHERE email = ?", (email,))
            new_hash = cursor.fetchone()[0]
            print(f"   New Hash: {new_hash[:50]}...")
            
            # Test SHA256 password verification
            expected_hash = new_hash[7:]  # Remove 'sha256$' prefix
            actual_hash = hashlib.sha256(new_password.encode()).hexdigest()
            is_valid = expected_hash == actual_hash
            print(f"   Password Verification: {'✅ Success' if is_valid else '❌ Failed'}")
            
        else:
            print(f"\n❌ User not found!")
            # List all users
            cursor.execute("SELECT id, email, role FROM users")
            users = cursor.fetchall()
            print(f"\nExisting users:")
            for user in users:
                print(f"   ID: {user[0]}, Email: {user[1]}, Role: {user[2]}")
        
        conn.close()
        return user is not None
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

def test_login_again():
    print(f"\n5️⃣ Testing login with reset password...")
    
    import requests
    
    login_data = {
        "email": "asha@ashastore.com", 
        "password": "AshaStore2024!"
    }
    
    try:
        response = requests.post("http://localhost:8000/api/v1/auth/login", json=login_data)
        print(f"   Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Login successful!")
            print(f"   👤 User: {data['user'].get('full_name', data['user'].get('first_name', 'Unknown'))}")
            print(f"   🎭 Role: {data['user']['role']}")
            return True
        else:
            error_data = response.json()
            print(f"   ❌ Login failed: {error_data}")
            return False
            
    except Exception as e:
        print(f"   ❌ Login test error: {e}")
        return False

if __name__ == "__main__":
    success = reset_password()
    if success:
        test_login_again()
    
    print("\n" + "=" * 50)
    print("🎯 SELLER DASHBOARD ACCESS:")
    print("   📧 Email: asha@ashastore.com")
    print("   🔑 Password: AshaStore2024!")
    print("   🔗 URL: http://localhost:3000")
    print("   📋 Status: Password Reset Complete")
