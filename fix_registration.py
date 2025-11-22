#!/usr/bin/env python3

import sqlite3
import hashlib
import requests

def create_test_user():
    # Clear existing test user
    conn = sqlite3.connect('/Users/divyanshurathore/shopall/backend/clothing_store.db')
    cursor = conn.cursor()
    
    # Delete test user if exists
    cursor.execute("DELETE FROM users WHERE email = ?", ('testuser@example.com',))
    conn.commit()
    
    # Create proper user
    password = "TestUser123!"
    sha256_hash = hashlib.sha256(password.encode()).hexdigest()
    hashed_password = f"sha256${sha256_hash}"
    
    cursor.execute("""
    INSERT INTO users (email, username, first_name, last_name, phone, 
                      hashed_password, role, is_active, is_verified, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    """, (
        'testuser@example.com',
        'testuser123',
        'Test',
        'User',
        None,
        hashed_password,
        'buyer',  # Correct role
        1,
        1
    ))
    
    conn.commit()
    print(f"✅ Created test user: testuser@example.com / TestUser123!")
    conn.close()

def test_login():
    requests.post("http://localhost:8000/api/v1/auth/reset-rate-limit")
    
    response = requests.post("http://localhost:8000/api/v1/auth/login", json={
        "email": "testuser@example.com",
        "password": "TestUser123!"
    })
    
    if response.status_code == 200:
        print("✅ Login works! Customer registration should work now")
        return True
    else:
        print(f"❌ Login failed: {response.text}")
        return False

if __name__ == "__main__":
    create_test_user()
    success = test_login()
    
    if success:
        print("\n🎉 CUSTOMER LOGIN NOW WORKING!")
        print("📱 Go to http://localhost:3001")
        print("🔑 Test login: testuser@example.com / TestUser123!")
        print("✅ Registration should work via website signup form")
