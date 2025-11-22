#!/usr/bin/env python3
"""
Create test products with different stock levels to demonstrate stock management
"""

import sqlite3
import requests

def create_test_products():
    print("🛍️ Creating Test Products with Stock Management\n")
    print("=" * 50)
    
    # Connect to database
    conn = sqlite3.connect('/Users/divyanshurathore/shopall/backend/clothing_store.db')
    cursor = conn.cursor()
    
    # Get seller ID (Asha)
    cursor.execute("SELECT id FROM users WHERE email = 'asha@ashastore.com'")
    seller = cursor.fetchone()
    if not seller:
        print("❌ Seller not found!")
        return
    
    seller_id = seller[0]
    print(f"✅ Found seller: Asha (ID: {seller_id})")
    
    # Create test products with different stock levels
    test_products = [
        {
            'name': 'Limited Edition Banarasi Saree',
            'description': 'Exclusive handwoven saree - Only 3 pieces available!',
            'price': 15000.00,
            'stock_quantity': 3,  # Only 3 in stock
            'category': 'saree',
            'sku': 'LIMITED-001'
        },
        {
            'name': 'Premium Silk Saree',
            'description': 'Beautiful silk saree with traditional design',
            'price': 8000.00,
            'stock_quantity': 10,  # 10 in stock
            'category': 'saree',
            'sku': 'SILK-002'
        },
        {
            'name': 'Sold Out Designer Lehenga',
            'description': 'Designer lehenga - Currently out of stock',
            'price': 25000.00,
            'stock_quantity': 0,  # Out of stock
            'category': 'lehenga',
            'sku': 'SOLD-003'
        },
        {
            'name': 'Cotton Kurti',
            'description': 'Comfortable cotton kurti for daily wear',
            'price': 1500.00,
            'stock_quantity': 50,  # Plenty in stock
            'category': 'kurti',
            'sku': 'COTTON-004'
        }
    ]
    
    print(f"\n📦 Creating {len(test_products)} test products...")
    
    for product in test_products:
        # Check if product already exists
        cursor.execute("SELECT id FROM products WHERE sku = ?", (product['sku'],))
        existing = cursor.fetchone()
        
        if existing:
            # Update existing product
            cursor.execute("""
                UPDATE products 
                SET stock_quantity = ?, price = ?, description = ?
                WHERE sku = ?
            """, (product['stock_quantity'], product['price'], product['description'], product['sku']))
            print(f"   📝 Updated: {product['name']} - Stock: {product['stock_quantity']}")
        else:
            # Insert new product
            cursor.execute("""
                INSERT INTO products (seller_id, name, description, price, stock_quantity, 
                                    category, sku, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', datetime('now'))
            """, (seller_id, product['name'], product['description'], product['price'], 
                  product['stock_quantity'], product['category'], product['sku']))
            print(f"   ✅ Created: {product['name']} - Stock: {product['stock_quantity']}")
    
    conn.commit()
    
    # Display all products with stock status
    print(f"\n📊 Current Product Inventory:")
    print("-" * 50)
    cursor.execute("""
        SELECT name, stock_quantity, price, status 
        FROM products 
        WHERE seller_id = ?
        ORDER BY stock_quantity ASC
    """, (seller_id,))
    
    products = cursor.fetchall()
    for product in products:
        name, stock, price, status = product
        stock_status = "🔴 OUT OF STOCK" if stock == 0 else f"🟡 LOW STOCK ({stock})" if stock <= 5 else f"🟢 IN STOCK ({stock})"
        print(f"   {name[:30]:<30} ₹{price:>8.2f} {stock_status}")
    
    conn.close()
    
    print("\n" + "=" * 50)
    print("✅ Test products created successfully!")
    print("\n🎯 STOCK MANAGEMENT FEATURES:")
    print("   1. Out of Stock: Shows 'Out of Stock' button (disabled)")
    print("   2. Low Stock (≤5): Shows warning 'Only X left!'")
    print("   3. In Stock: Normal 'Add to Cart' button")
    print("   4. Quantity limits: Can't add more than available stock")
    print("   5. Cart validation: Prevents exceeding stock in cart")
    print("\n🌐 Test it at: http://localhost:3001/collections")

if __name__ == "__main__":
    create_test_products()
