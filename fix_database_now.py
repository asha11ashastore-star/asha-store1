#!/usr/bin/env python3
"""
Fix database - Make last_name nullable
"""

DATABASE_URL = "postgresql://asha_store_db_user:H4kVdUypudmMH6SbVL6bsQ19qIRLgqwZ@dpg-d4hv70ogjchc73dhqr40-a.singapore-postgres.render.com/asha_store_db"

print("🔧 FIXING DATABASE NOW...")
print("=" * 60)

try:
    import psycopg2
    
    print("✅ Connecting to database...")
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    print("✅ Connected!")
    
    print("\n📝 Running: ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;")
    cur.execute("ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;")
    conn.commit()
    
    print("✅ SUCCESS! Command executed!")
    
    # Verify
    print("\n🔍 Verifying...")
    cur.execute("""
        SELECT column_name, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_name';
    """)
    
    result = cur.fetchone()
    if result and result[1] == 'YES':
        print(f"✅ Column: {result[0]}")
        print(f"✅ Nullable: {result[1]} ✅")
        print("\n" + "=" * 60)
        print("🎉 DATABASE FIXED!")
        print("=" * 60)
        print("\n✅ You can now signup with single names!")
        print("   Example: Name = 'prankur'")
        print("\n🚀 Go test signup now!")
    else:
        print("⚠️ Could not verify, but command was executed")
    
    cur.close()
    conn.close()
    
except ImportError:
    print("\n❌ psycopg2 not installed!")
    print("\nInstalling now...")
    import subprocess
    subprocess.check_call(['pip3', 'install', 'psycopg2-binary'])
    print("\n✅ Installed! Running script again...")
    import sys
    subprocess.check_call([sys.executable, __file__])
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)
