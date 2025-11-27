#!/usr/bin/env python3
"""
Fix last_name column to be nullable in the database
Run this script to update the database schema
"""

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("❌ DATABASE_URL not found in environment variables!")
    print("Please set DATABASE_URL in your .env file")
    exit(1)

print("🔧 Fixing database schema for last_name column...")
print(f"Database: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'Unknown'}")

try:
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    # Connect and execute ALTER TABLE
    with engine.connect() as conn:
        print("\n1️⃣ Making last_name column nullable...")
        
        # Alter the column to allow NULL values
        alter_query = text("""
            ALTER TABLE users 
            ALTER COLUMN last_name DROP NOT NULL;
        """)
        
        conn.execute(alter_query)
        conn.commit()
        
        print("✅ Successfully altered last_name column to be nullable!")
        
        # Verify the change
        print("\n2️⃣ Verifying the change...")
        verify_query = text("""
            SELECT column_name, is_nullable, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name = 'last_name';
        """)
        
        result = conn.execute(verify_query)
        row = result.fetchone()
        
        if row:
            print(f"✅ Column: {row[0]}")
            print(f"✅ Nullable: {row[1]} (should be 'YES')")
            print(f"✅ Type: {row[2]}")
        else:
            print("⚠️ Could not verify - but ALTER likely succeeded")
        
        print("\n✅ DATABASE FIX COMPLETE!")
        print("\n🎯 Now users can signup with single names like 'prankur'!")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\n📝 Manual fix:")
    print("Run this SQL command directly in your database:")
    print("ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;")
    exit(1)
