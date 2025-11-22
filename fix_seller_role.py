#!/usr/bin/env python3
"""
Fix seller role to use correct uppercase enum value
"""

import sqlite3
from pathlib import Path

# Database paths
DB_PATHS = [
    "/Users/divyanshurathore/shopall/backend/clothing_store.db", 
    "/Users/divyanshurathore/shopall/backend/single_seller_store.db"
]

def fix_seller_role():
    """Fix seller role to uppercase SELLER"""
    
    for db_path in DB_PATHS:
        if not Path(db_path).exists():
            print(f"Database {db_path} does not exist, skipping...")
            continue
            
        print(f"Fixing seller role in {db_path}...")
        
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Check current users
            cursor.execute("SELECT id, email, role FROM users WHERE email = ?", ("asha@ashastore.com",))
            user = cursor.fetchone()
            
            if user:
                print(f"Found user: ID={user[0]}, Email={user[1]}, Current Role={user[2]}")
                
                # Update role to uppercase
                cursor.execute("UPDATE users SET role = ? WHERE email = ?", ("SELLER", "asha@ashastore.com"))
                
                # Verify update
                cursor.execute("SELECT id, email, role FROM users WHERE email = ?", ("asha@ashastore.com",))
                updated_user = cursor.fetchone()
                
                if updated_user:
                    print(f"✅ Updated user: ID={updated_user[0]}, Email={updated_user[1]}, New Role={updated_user[2]}")
                
                conn.commit()
            else:
                print(f"❌ User asha@ashastore.com not found in {db_path}")
                
        except Exception as e:
            print(f"❌ Error fixing role in {db_path}: {e}")
            conn.rollback()
        finally:
            conn.close()

if __name__ == "__main__":
    print("🔧 Fixing seller role...")
    fix_seller_role()
    print("✅ Role fix completed!")
