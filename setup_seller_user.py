#!/usr/bin/env python3
"""
Script to create/verify the Asha seller user in the database
"""

import sqlite3
from passlib.context import CryptContext
import json
from pathlib import Path

# Database paths
DB_PATHS = [
    "/Users/divyanshurathore/shopall/backend/clothing_store.db",
    "/Users/divyanshurathore/shopall/backend/single_seller_store.db"
]

# Seller user details
SELLER_USER = {
    "email": "asha@ashastore.com", 
    "username": "asha_dhaundiyal",
    "first_name": "Asha",
    "last_name": "Dhaundiyal", 
    "phone": "+91 9876543210",
    "password": "AshaStore2024!",
    "role": "seller",
    "is_active": True,
    "is_verified": True
}

# Password hashing context (same as backend)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    """Hash password using bcrypt (same as backend)"""
    return pwd_context.hash(password)

def check_user_exists(cursor, email):
    """Check if user exists in database"""
    cursor.execute("SELECT id, email, role FROM users WHERE email = ?", (email,))
    return cursor.fetchone()

def create_user_table_if_not_exists(cursor):
    """Create users table if it doesn't exist"""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(50) UNIQUE NOT NULL,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            phone VARCHAR(20),
            hashed_password VARCHAR(255) NOT NULL,
            role VARCHAR(10) NOT NULL DEFAULT 'buyer',
            is_active BOOLEAN NOT NULL DEFAULT 1,
            is_verified BOOLEAN NOT NULL DEFAULT 0,
            avatar_url VARCHAR(500),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME
        )
    """)

def setup_seller_user():
    """Set up Asha as the seller user in all databases"""
    
    hashed_password = hash_password(SELLER_USER["password"])
    
    for db_path in DB_PATHS:
        if not Path(db_path).exists():
            print(f"Database {db_path} does not exist, skipping...")
            continue
            
        print(f"Setting up seller user in {db_path}...")
        
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Create users table if it doesn't exist
            create_user_table_if_not_exists(cursor)
            
            # Check if user already exists
            existing_user = check_user_exists(cursor, SELLER_USER["email"])
            
            if existing_user:
                print(f"User {SELLER_USER['email']} already exists with ID {existing_user[0]}")
                
                # Update user to ensure it's a seller
                cursor.execute("""
                    UPDATE users SET 
                    role = ?, 
                    is_active = ?, 
                    is_verified = ?,
                    hashed_password = ?,
                    updated_at = CURRENT_TIMESTAMP
                    WHERE email = ?
                """, ('seller', True, True, hashed_password, SELLER_USER["email"]))
                
                print(f"Updated user {SELLER_USER['email']} to seller role")
                
            else:
                # Create new user
                cursor.execute("""
                    INSERT INTO users 
                    (email, username, first_name, last_name, phone, hashed_password, role, is_active, is_verified)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    SELLER_USER["email"],
                    SELLER_USER["username"], 
                    SELLER_USER["first_name"],
                    SELLER_USER["last_name"],
                    SELLER_USER["phone"],
                    hashed_password,
                    'seller',
                    True,
                    True
                ))
                
                user_id = cursor.lastrowid
                print(f"Created new seller user {SELLER_USER['email']} with ID {user_id}")
            
            # Verify user was created/updated
            final_user = check_user_exists(cursor, SELLER_USER["email"])
            if final_user:
                print(f"✅ Seller user verified: ID={final_user[0]}, Email={final_user[1]}, Role={final_user[2]}")
            
            conn.commit()
            
        except Exception as e:
            print(f"❌ Error setting up user in {db_path}: {e}")
            conn.rollback()
        finally:
            conn.close()
    
    print(f"\n🎉 Seller user setup completed!")
    print(f"📧 Email: {SELLER_USER['email']}")
    print(f"🔑 Password: {SELLER_USER['password']}")
    print(f"👤 Role: seller")
    print(f"✅ Active & Verified")

if __name__ == "__main__":
    print("🔧 Setting up Asha seller user...")
    setup_seller_user()
