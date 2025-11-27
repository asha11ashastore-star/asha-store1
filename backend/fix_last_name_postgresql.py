#!/usr/bin/env python3
"""
Fix last_name column to be nullable in PostgreSQL database (PRODUCTION)
This script connects to the PRODUCTION database on Render
"""

# PRODUCTION DATABASE URL (from Render)
# Replace this with your actual Render PostgreSQL URL
PRODUCTION_DB_URL = "YOUR_RENDER_POSTGRES_URL_HERE"

# Or uncomment and use environment variable:
import os
PRODUCTION_DB_URL = os.getenv('DATABASE_URL') or PRODUCTION_DB_URL

print("🚨 PRODUCTION DATABASE FIX 🚨")
print("=" * 50)

if PRODUCTION_DB_URL == "YOUR_RENDER_POSTGRES_URL_HERE":
    print("\n❌ ERROR: You need to set your Render PostgreSQL URL!")
    print("\n📋 How to find it:")
    print("1. Go to: https://dashboard.render.com")
    print("2. Click on your backend service")
    print("3. Go to 'Environment' tab")
    print("4. Copy the DATABASE_URL value")
    print("5. Replace PRODUCTION_DB_URL in this script")
    print("\nOr set it as environment variable:")
    print("export DATABASE_URL='your_postgres_url'")
    exit(1)

try:
    from sqlalchemy import create_engine, text
    
    print(f"\n🔗 Connecting to production database...")
    print(f"Host: {PRODUCTION_DB_URL.split('@')[1].split('/')[0] if '@' in PRODUCTION_DB_URL else 'Unknown'}")
    
    # Create engine for PostgreSQL
    engine = create_engine(PRODUCTION_DB_URL)
    
    with engine.connect() as conn:
        print("\n1️⃣ Checking current schema...")
        
        check_query = text("""
            SELECT column_name, is_nullable, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name = 'last_name';
        """)
        
        result = conn.execute(check_query)
        row = result.fetchone()
        
        if row:
            print(f"   Column: {row[0]}")
            print(f"   Nullable: {row[1]} ({'✅ Already fixed!' if row[1] == 'YES' else '❌ Needs fix'})")
            print(f"   Type: {row[2]}")
            
            if row[1] == 'YES':
                print("\n✅ Column is already nullable! No changes needed.")
                exit(0)
        
        print("\n2️⃣ Making last_name column nullable...")
        
        # ALTER TABLE for PostgreSQL
        alter_query = text("""
            ALTER TABLE users 
            ALTER COLUMN last_name DROP NOT NULL;
        """)
        
        conn.execute(alter_query)
        conn.commit()
        
        print("✅ Successfully altered last_name column!")
        
        # Verify
        print("\n3️⃣ Verifying the change...")
        result = conn.execute(check_query)
        row = result.fetchone()
        
        if row and row[1] == 'YES':
            print("✅ VERIFIED! Column is now nullable!")
            print(f"   Column: {row[0]}")
            print(f"   Nullable: {row[1]} ✅")
            print(f"   Type: {row[2]}")
        
        print("\n" + "=" * 50)
        print("🎉 DATABASE FIX COMPLETE!")
        print("=" * 50)
        print("\n✅ Users can now signup with single names!")
        print("   Example: 'prankur', 'John', 'Divyanshu'")
        print("\n🚀 Go test signup on your website now!")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\n" + "=" * 50)
    print("📝 MANUAL FIX INSTRUCTIONS:")
    print("=" * 50)
    print("\n1. Go to Render Dashboard:")
    print("   https://dashboard.render.com")
    print("\n2. Find your PostgreSQL database")
    print("\n3. Click 'Connect' → 'External Connection'")
    print("\n4. Copy the connection command")
    print("\n5. Run in terminal:")
    print("   psql <your_connection_string>")
    print("\n6. Run this SQL command:")
    print("   ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;")
    print("\n7. Verify:")
    print("   \\d users")
    print("   (Check that last_name shows 'nullable')")
    print("\n" + "=" * 50)
    exit(1)
