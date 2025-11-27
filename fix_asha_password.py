#!/usr/bin/env python3
"""
Check and fix Asha's password in the database
"""
import sys
sys.path.insert(0, '/Users/divyanshurathore/shopall/backend')

from app.database import SessionLocal
from app.models import User
from app.auth import auth_manager
import hashlib

def fix_password():
    """Check and fix Asha's password"""
    db = SessionLocal()
    
    try:
        # Find Asha's user
        user = db.query(User).filter(User.email == "asha@ashastore.com").first()
        
        if not user:
            print("❌ User not found!")
            return
        
        print(f"✅ User found:")
        print(f"   ID: {user.id}")
        print(f"   Email: {user.email}")
        print(f"   Username: {user.username}")
        print(f"   Role: {user.role}")
        print(f"   Current hash: {user.hashed_password[:50]}...")
        print()
        
        # Test current password
        test_password = "AshaStore2024!"
        print(f"🔍 Testing password verification...")
        
        # Try SHA256 verification
        if user.hashed_password.startswith("sha256$"):
            expected_hash = user.hashed_password[7:]
            actual_hash = hashlib.sha256(test_password.encode()).hexdigest()
            if expected_hash == actual_hash:
                print("✅ Password already correct (SHA256)!")
                print("   Login should work!")
                return
            else:
                print("❌ SHA256 password doesn't match")
        
        # Create new SHA256 hash
        print(f"\n🔧 Updating password to use SHA256...")
        new_hash = f"sha256${hashlib.sha256(test_password.encode()).hexdigest()}"
        user.hashed_password = new_hash
        db.commit()
        
        print(f"✅ Password updated successfully!")
        print(f"   New hash: {new_hash[:50]}...")
        print()
        print("You can now login with:")
        print(f"   Email: asha@ashastore.com")
        print(f"   Password: AshaStore2024!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_password()
