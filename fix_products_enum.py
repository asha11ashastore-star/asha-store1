#!/usr/bin/env python3
"""
Fix the enum issues in the database
"""

import sqlite3

def fix_enum_values():
    print("🔧 Fixing enum values in database\n")
    print("=" * 50)
    
    conn = sqlite3.connect('/Users/divyanshurathore/shopall/backend/clothing_store.db')
    cursor = conn.cursor()
    
    # Fix category values - make sure they match enum
    print("1️⃣ Fixing category values...")
    
    # Map old values to correct enum values
    category_fixes = {
        'KURTI': 'kurti',
        'LEHENGA': 'lehenga',
        'SAREE': 'saree',
        'COTTON_SAREE': 'cotton_saree',
        'SILK_SAREE': 'silk_saree',
        'KANTHA_SAREE': 'kantha_saree',
        'TUSSAR_SILK_SAREE': 'tussar_silk_saree'
    }
    
    for old, new in category_fixes.items():
        cursor.execute("UPDATE products SET category = ? WHERE UPPER(category) = ?", (new, old))
        count = cursor.rowcount
        if count > 0:
            print(f"   Fixed {count} products with category {old} -> {new}")
    
    # Fix status values
    print("\n2️⃣ Fixing status values...")
    
    status_fixes = {
        'ACTIVE': 'active',
        'DRAFT': 'draft',
        'DELETED': 'deleted',
        'INACTIVE': 'inactive'
    }
    
    for old, new in status_fixes.items():
        cursor.execute("UPDATE products SET status = ? WHERE UPPER(status) = ?", (new, old))
        count = cursor.rowcount
        if count > 0:
            print(f"   Fixed {count} products with status {old} -> {new}")
    
    conn.commit()
    
    # Show current values
    print("\n3️⃣ Current unique values:")
    
    cursor.execute("SELECT DISTINCT category FROM products")
    categories = cursor.fetchall()
    print(f"   Categories: {[c[0] for c in categories]}")
    
    cursor.execute("SELECT DISTINCT status FROM products")
    statuses = cursor.fetchall()
    print(f"   Statuses: {[s[0] for s in statuses]}")
    
    # Check for NULL seller_id
    cursor.execute("SELECT COUNT(*) FROM products WHERE seller_id IS NULL")
    null_count = cursor.fetchone()[0]
    if null_count > 0:
        print(f"\n4️⃣ Fixing {null_count} products with NULL seller_id...")
        cursor.execute("UPDATE products SET seller_id = 1 WHERE seller_id IS NULL")
        conn.commit()
        print(f"   ✅ Set seller_id to 1 (Asha) for all products")
    
    conn.close()
    print("\n✅ Database enum values fixed!")

if __name__ == "__main__":
    fix_enum_values()
