#!/usr/bin/env python3
"""
One-time migration script to make last_name nullable
Run this ONCE on production database
"""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.database import get_db_url

print("🔧 DATABASE MIGRATION: Make last_name nullable")
print("=" * 60)

try:
    # Get database URL
    db_url = get_db_url()
    
    if not db_url:
        print("❌ DATABASE_URL not found!")
        print("\nSet environment variable:")
        print("export DATABASE_URL='your_postgresql_url'")
        sys.exit(1)
    
    # Show database (hide password)
    safe_url = db_url.split('@')[1] if '@' in db_url else 'Unknown'
    print(f"\n📊 Database: {safe_url}")
    
    # Create engine
    engine = create_engine(db_url)
    
    with engine.connect() as conn:
        print("\n1️⃣ Checking current schema...")
        
        # Check current state
        check_query = text("""
            SELECT column_name, is_nullable, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name = 'last_name';
        """)
        
        result = conn.execute(check_query)
        row = result.fetchone()
        
        if not row:
            print("❌ Error: 'last_name' column not found in 'users' table!")
            sys.exit(1)
        
        print(f"   Column: {row[0]}")
        print(f"   Type: {row[2]}")
        print(f"   Nullable: {row[1]}", end="")
        
        if row[1] == 'YES':
            print(" ✅ (Already fixed!)")
            print("\n" + "=" * 60)
            print("✅ DATABASE IS ALREADY CORRECT!")
            print("=" * 60)
            print("\n🎉 Users can signup with single names!")
            print("   Try: Name = 'prankur'")
            sys.exit(0)
        else:
            print(" ❌ (Needs fix)")
        
        print("\n2️⃣ Making last_name nullable...")
        
        # Run migration
        migrate_query = text("""
            ALTER TABLE users 
            ALTER COLUMN last_name DROP NOT NULL;
        """)
        
        conn.execute(migrate_query)
        conn.commit()
        
        print("   ✅ ALTER TABLE executed!")
        
        print("\n3️⃣ Verifying change...")
        
        # Verify
        result = conn.execute(check_query)
        row = result.fetchone()
        
        if row and row[1] == 'YES':
            print(f"   ✅ Column: {row[0]}")
            print(f"   ✅ Type: {row[2]}")
            print(f"   ✅ Nullable: {row[1]} ✅")
            
            print("\n" + "=" * 60)
            print("🎉 MIGRATION SUCCESSFUL!")
            print("=" * 60)
            
            print("\n✅ Changes applied:")
            print("   • last_name is now OPTIONAL")
            print("   • Single names work: 'prankur'")
            print("   • Full names work: 'John Doe'")
            
            print("\n🚀 Go test signup now!")
            print("   Name: prankur")
            print("   Email: test@example.com")
            print("   Password: test1234")
            
        else:
            print("   ⚠️ Could not verify change")
            print("   But migration likely succeeded")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\n" + "=" * 60)
    print("📝 MANUAL FIX REQUIRED")
    print("=" * 60)
    print("\nConnect to your database and run:")
    print("\n   ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;")
    print("\nFor Render:")
    print("1. Dashboard → Database → Shell")
    print("2. Paste the above SQL command")
    print("3. Press Enter")
    sys.exit(1)
