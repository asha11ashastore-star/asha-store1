#!/usr/bin/env python3
"""
Initialize the company_info table in the database
"""

import sqlite3
import json
from pathlib import Path

# Database paths
DB_PATHS = [
    "/Users/divyanshurathore/shopall/backend/clothing_store.db",
    "/Users/divyanshurathore/shopall/backend/single_seller_store.db"
]

def create_company_info_table():
    """Create company_info table with default data"""
    
    default_features = [
        {"title": "100% Handwoven", "description": "Every product is authentically handcrafted by skilled artisans"},
        {"title": "Premium Quality", "description": "Carefully curated collection with the finest materials"},
        {"title": "Ethical Sourcing", "description": "Direct partnerships ensuring fair wages for artisans"},
        {"title": "Cultural Heritage", "description": "Preserving traditional techniques and designs"},
        {"title": "Sustainable Fashion", "description": "Eco-friendly practices supporting environmental conservation"},
        {"title": "Global Reach", "description": "Bringing authentic Indian craftsmanship worldwide"}
    ]
    
    for db_path in DB_PATHS:
        if not Path(db_path).exists():
            print(f"Database {db_path} does not exist, skipping...")
            continue
            
        print(f"Setting up company_info table in {db_path}...")
        
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Create table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS company_info (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    artisans_supported VARCHAR(20) NOT NULL DEFAULT '500+',
                    villages_reached VARCHAR(20) NOT NULL DEFAULT '50+',
                    happy_customers VARCHAR(20) NOT NULL DEFAULT '10,000+',
                    years_of_excellence VARCHAR(20) NOT NULL DEFAULT '5+',
                    features TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME
                )
            """)
            
            # Check if data already exists
            cursor.execute("SELECT COUNT(*) FROM company_info")
            count = cursor.fetchone()[0]
            
            if count == 0:
                # Insert default data
                cursor.execute("""
                    INSERT INTO company_info 
                    (artisans_supported, villages_reached, happy_customers, years_of_excellence, features)
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    "500+",
                    "50+", 
                    "10,000+",
                    "5+",
                    json.dumps(default_features)
                ))
                
                print(f"✅ Created company_info table with default data")
            else:
                print(f"ℹ️  Company info data already exists")
            
            conn.commit()
            
            # Verify data
            cursor.execute("SELECT artisans_supported, villages_reached, happy_customers, years_of_excellence FROM company_info LIMIT 1")
            row = cursor.fetchone()
            if row:
                print(f"   📊 Current stats: {row[0]} artisans, {row[1]} villages, {row[2]} customers, {row[3]} years")
            
        except Exception as e:
            print(f"❌ Error setting up {db_path}: {e}")
            conn.rollback()
        finally:
            conn.close()

if __name__ == "__main__":
    print("🔧 Initializing company info tables...")
    create_company_info_table()
    print("✅ Company info initialization completed!")
