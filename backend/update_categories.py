#!/usr/bin/env python3
"""
Script to update existing product categories to new detailed Indian clothing categories
"""

import sqlite3
import json
from pathlib import Path

# Database file paths
DB_PATHS = [
    "clothing_store.db",
    "single_seller_store.db"
]

# Category mapping from old to new
CATEGORY_MAPPING = {
    "clothing": "kurti",  # Default fallback
    "food": "kurti",      # This shouldn't exist but fallback
    "department_store": "kurti"  # This shouldn't exist but fallback
}

def update_database_categories():
    """Update categories in all database files"""
    
    for db_path in DB_PATHS:
        if not Path(db_path).exists():
            print(f"Database {db_path} does not exist, skipping...")
            continue
            
        print(f"Updating categories in {db_path}...")
        
        try:
            # Connect to database
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Check if products table exists
            cursor.execute("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name='products';
            """)
            
            if not cursor.fetchone():
                print(f"Products table does not exist in {db_path}, skipping...")
                conn.close()
                continue
            
            # Get current products
            cursor.execute("SELECT id, category, name, tags FROM products")
            products = cursor.fetchall()
            
            print(f"Found {len(products)} products to update")
            
            # Update each product
            for product_id, old_category, product_name, tags_str in products:
                # Determine new category based on product name and existing tags
                new_category = determine_new_category(product_name, tags_str, old_category)
                
                # Update the product
                cursor.execute(
                    "UPDATE products SET category = ? WHERE id = ?",
                    (new_category, product_id)
                )
                
                print(f"Updated product {product_id}: {old_category} -> {new_category}")
            
            # Commit changes
            conn.commit()
            print(f"Successfully updated {len(products)} products in {db_path}")
            
        except Exception as e:
            print(f"Error updating {db_path}: {e}")
            conn.rollback()
        finally:
            conn.close()

def determine_new_category(product_name, tags_str, old_category):
    """Determine the appropriate new category based on product info"""
    
    # Parse tags if available
    tags = {}
    if tags_str:
        try:
            tags = json.loads(tags_str)
        except:
            pass
    
    # Convert to lowercase for matching
    name_lower = product_name.lower() if product_name else ""
    
    # Category detection logic based on keywords
    if any(keyword in name_lower for keyword in ['saree', 'sari']):
        return 'saree'
    elif any(keyword in name_lower for keyword in ['lehenga', 'lehnga']):
        return 'lehenga'
    elif any(keyword in name_lower for keyword in ['kurti', 'kurta', 'kurtis']):
        return 'kurti'
    elif any(keyword in name_lower for keyword in ['salwar', 'kameez', 'suit']):
        return 'salwar_kameez'
    elif any(keyword in name_lower for keyword in ['anarkali']):
        return 'anarkali'
    elif any(keyword in name_lower for keyword in ['churidar']):
        return 'churidar'
    elif any(keyword in name_lower for keyword in ['sharara']):
        return 'sharara'
    elif any(keyword in name_lower for keyword in ['palazzo']):
        return 'palazzo'
    elif any(keyword in name_lower for keyword in ['dress']):
        return 'dress'
    elif any(keyword in name_lower for keyword in ['top']):
        return 'top'
    elif any(keyword in name_lower for keyword in ['shirt']):
        return 'shirt'
    elif any(keyword in name_lower for keyword in ['trouser', 'pants']):
        return 'trouser'
    elif any(keyword in name_lower for keyword in ['jeans']):
        return 'jeans'
    elif any(keyword in name_lower for keyword in ['skirt']):
        return 'skirt'
    elif any(keyword in name_lower for keyword in ['blouse']):
        return 'blouse'
    elif any(keyword in name_lower for keyword in ['sherwani']):
        return 'sherwani'
    elif any(keyword in name_lower for keyword in ['dhoti']):
        return 'dhoti'
    elif any(keyword in name_lower for keyword in ['dupatta']):
        return 'dupatta'
    elif any(keyword in name_lower for keyword in ['stole']):
        return 'stole'
    elif any(keyword in name_lower for keyword in ['scarf']):
        return 'scarf'
    else:
        # Default fallback based on old category or generic kurti
        return CATEGORY_MAPPING.get(old_category, 'kurti')

if __name__ == "__main__":
    print("Starting category update process...")
    update_database_categories()
    print("Category update completed!")
