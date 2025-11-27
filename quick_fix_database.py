#!/usr/bin/env python3
"""
Quick fix for database - run this if you have the DATABASE_URL
"""

import os

# Paste your Render PostgreSQL connection string here:
# Get it from: Render Dashboard → Database → Connect → External Connection
DATABASE_URL = os.getenv('DATABASE_URL') or input("Paste your DATABASE_URL: ")

if not DATABASE_URL or DATABASE_URL.strip() == "":
    print("❌ No DATABASE_URL provided!")
    print("\nGet it from:")
    print("1. Render Dashboard")
    print("2. Click your database")
    print("3. Click 'Connect'")
    print("4. Copy the 'External Connection String'")
    exit(1)

print("🔧 Fixing database...")
print("=" * 60)

try:
    import psycopg2
    
    # Connect
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    print("✅ Connected to database!")
    
    # Run the fix
    print("\n📝 Running: ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;")
    cur.execute("ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;")
    conn.commit()
    
    print("✅ SUCCESS! Command executed!")
    
    # Verify
    cur.execute("""
        SELECT column_name, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_name';
    """)
    
    result = cur.fetchone()
    if result and result[1] == 'YES':
        print("\n✅ VERIFIED! last_name is now nullable!")
        print("=" * 60)
        print("🎉 DATABASE FIXED!")
        print("=" * 60)
        print("\n✅ You can now signup with single names!")
        print("   Try: Name = 'prankur'")
    
    cur.close()
    conn.close()
    
except ImportError:
    print("❌ psycopg2 not installed!")
    print("\nInstall it:")
    print("pip install psycopg2-binary")
    print("\nThen run this script again:")
    print("python3 quick_fix_database.py")
    exit(1)
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nPlease run the SQL command manually in Render Shell:")
    print("ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;")
    exit(1)
