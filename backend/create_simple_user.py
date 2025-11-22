#!/usr/bin/env python3
"""
Simple script to create a test user directly using SQL
"""
import sqlite3
import hashlib
import datetime
from pathlib import Path

def create_simple_user():
    """Create a test user directly in SQLite database"""
    
    # Connect to the database
    db_path = Path("./clothing_store.db")
    
    try:
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        # First, check if users table exists and its structure
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            print("Users table doesn't exist. Let's check what tables exist:")
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            print("Available tables:", [table[0] for table in tables])
            conn.close()
            return
        
        # Check table structure
        cursor.execute("PRAGMA table_info(users)")
        columns = cursor.fetchall()
        print("Users table columns:", [col[1] for col in columns])
        
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = ?", ("owner@clothingstore.com",))
        existing_user = cursor.fetchone()
        
        if existing_user:
            print("Test user already exists!")
            conn.close()
            return
        
        # Create a simple hash (not secure for production, but works for testing)
        password = "password123"
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        # Insert user
        now = datetime.datetime.now().isoformat()
        cursor.execute("""
            INSERT INTO users (
                email, username, first_name, last_name, phone, 
                hashed_password, role, is_active, is_verified, 
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "owner@clothingstore.com",
            "owner_user", 
            "Test",
            "Customer",
            "+919999999999",
            f"sha256${password_hash}",  # Mark it as SHA256 for custom verification
            "buyer",
            1,  # is_active
            1,  # is_verified
            now,
            now
        ))
        
        conn.commit()
        conn.close()
        
        print("Test user created successfully!")
        print(f"Email: owner@clothingstore.com")
        print(f"Password: {password}")
        print("Note: This uses simple SHA256 hashing for testing only")
        
    except Exception as e:
        print(f"Error: {e}")
        if conn:
            conn.close()

if __name__ == "__main__":
    create_simple_user()
