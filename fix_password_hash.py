#!/usr/bin/env python3
"""
Fix password hash to use SHA256 format that backend can understand
"""

import sqlite3
import hashlib
from pathlib import Path

# Database paths
DB_PATHS = [
    "/Users/divyanshurathore/shopall/backend/clothing_store.db", 
    "/Users/divyanshurathore/shopall/backend/single_seller_store.db"
]

PASSWORD = "AshaStore2024!"

def create_sha256_hash(password):
    """Create SHA256 hash with prefix that backend recognizes"""
    hash_value = hashlib.sha256(password.encode()).hexdigest()
    return f"sha256${hash_value}"

def fix_password_hash():
    """Fix password hash format"""
    
    correct_hash = create_sha256_hash(PASSWORD)
    print(f"Creating hash: {correct_hash[:20]}...")
    
    for db_path in DB_PATHS:
        if not Path(db_path).exists():
            print(f"Database {db_path} does not exist, skipping...")
            continue
            
        print(f"Fixing password hash in {db_path}...")
        
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Update password hash
            cursor.execute(
                "UPDATE users SET hashed_password = ? WHERE email = ?", 
                (correct_hash, "asha@ashastore.com")
            )
            
            # Verify update
            cursor.execute(
                "SELECT email, hashed_password FROM users WHERE email = ?", 
                ("asha@ashastore.com",)
            )
            user = cursor.fetchone()
            
            if user:
                print(f"✅ Updated password hash for {user[0]}")
                print(f"   Hash format: {user[1][:20]}...")
            
            conn.commit()
                
        except Exception as e:
            print(f"❌ Error fixing password in {db_path}: {e}")
            conn.rollback()
        finally:
            conn.close()

if __name__ == "__main__":
    print("🔧 Fixing password hash format...")
    fix_password_hash()
    print("✅ Password fix completed!")
