#!/usr/bin/env python3
"""Fix product category and status enum values in database"""

import sqlite3
import sys

def fix_enums():
    try:
        # Connect to database
        conn = sqlite3.connect('backend/clothing_store.db')
        cursor = conn.cursor()
        
        # First, let's see what values we have
        cursor.execute("SELECT DISTINCT category FROM products")
        categories = cursor.fetchall()
        print("Current categories:", [c[0] for c in categories])
        
        cursor.execute("SELECT DISTINCT status FROM products")
        statuses = cursor.fetchall()
        print("Current statuses:", [s[0] for s in statuses])
        
        # Update status values to match enum (lowercase)
        status_updates = [
            ("UPDATE products SET status = 'draft' WHERE status = 'DRAFT'", ),
            ("UPDATE products SET status = 'active' WHERE status = 'ACTIVE'", ),
            ("UPDATE products SET status = 'inactive' WHERE status = 'INACTIVE'", ),
        ]
        
        for query in status_updates:
            cursor.execute(query[0])
            if cursor.rowcount > 0:
                print(f"Updated {cursor.rowcount} rows with query: {query[0]}")
        
        # Commit changes
        conn.commit()
        
        # Verify the updates
        cursor.execute("SELECT DISTINCT category FROM products")
        categories = cursor.fetchall()
        print("\nUpdated categories:", [c[0] for c in categories])
        
        cursor.execute("SELECT DISTINCT status FROM products")
        statuses = cursor.fetchall()
        print("Updated statuses:", [s[0] for s in statuses])
        
        # Show sample products
        cursor.execute("SELECT id, name, category, status FROM products LIMIT 5")
        products = cursor.fetchall()
        print("\nSample products:")
        for p in products:
            print(f"  ID: {p[0]}, Name: {p[1]}, Category: {p[2]}, Status: {p[3]}")
        
        conn.close()
        print("\nEnum values fixed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    fix_enums()
