#!/usr/bin/env python3
"""
Add sample products to the clothing store database
"""
import requests
import json

# API base URL
BASE_URL = "http://localhost:8000"

# Sample products data for Aशा store
sample_products = [
    {
        "name": "Elegant Banarasi Silk Saree",
        "description": "Beautiful traditional Banarasi silk saree perfect for weddings and special occasions. Handwoven with intricate patterns and gold zari work.",
        "category": "saree",
        "price": 2999.00,
        "discounted_price": 2499.00,
        "stock_quantity": 15,
        "brand": "Aशā",
        "color": "Red",
        "material": "Pure Silk",
        "sizes_available": '["Free Size"]',
        "gender": "Women"
    },
    {
        "name": "Traditional Cotton Saree",
        "description": "Handwoven cotton saree with traditional block print patterns. Perfect for daily wear and casual occasions.",
        "category": "saree", 
        "price": 1899.00,
        "discounted_price": 1599.00,
        "stock_quantity": 25,
        "brand": "Aशā",
        "color": "Blue",
        "material": "Cotton",
        "sizes_available": '["Free Size"]',
        "gender": "Women"
    },
    {
        "name": "Designer Kurti Set",
        "description": "Beautiful kurti set with matching dupatta. Comfortable cotton fabric with elegant embroidery work.",
        "category": "kurti",
        "price": 1299.00,
        "discounted_price": 999.00,
        "stock_quantity": 30,
        "brand": "Aशā",
        "color": "Pink",
        "material": "Cotton",
        "sizes_available": '["S", "M", "L", "XL"]',
        "gender": "Women"
    },
    {
        "name": "Embroidered Kurti",
        "description": "Comfortable cotton kurti with beautiful embroidery work. Perfect for casual and formal occasions.",
        "category": "kurti",
        "price": 899.00,
        "stock_quantity": 20,
        "brand": "Aशā",
        "color": "White",
        "material": "Cotton",
        "sizes_available": '["S", "M", "L", "XL"]',
        "gender": "Women"
    },
    {
        "name": "Silk Dupatta",
        "description": "Pure silk dupatta with golden border. Perfect accessory for ethnic wear.",
        "category": "dupatta",
        "price": 599.00,
        "stock_quantity": 40,
        "brand": "Aशā",
        "color": "Golden",
        "material": "Silk",
        "sizes_available": '["Free Size"]',
        "gender": "Women"
    },
    {
        "name": "Cotton Stole",
        "description": "Soft cotton stole for everyday wear. Lightweight and comfortable.",
        "category": "stole",
        "price": 399.00,
        "stock_quantity": 35,
        "brand": "Aशā",
        "color": "Cream",
        "material": "Cotton",
        "sizes_available": '["Free Size"]',
        "gender": "Women"
    },
    {
        "name": "Handloom Saree",
        "description": "Traditional handloom saree with authentic weaving patterns. Supporting local artisans.",
        "category": "saree",
        "price": 2499.00,
        "stock_quantity": 12,
        "brand": "Aशā",
        "color": "Green",
        "material": "Handloom Cotton",
        "sizes_available": '["Free Size"]',
        "gender": "Women"
    },
    {
        "name": "Party Wear Kurti",
        "description": "Elegant party wear kurti with sequin work. Perfect for festive occasions.",
        "category": "kurti",
        "price": 1599.00,
        "stock_quantity": 18,
        "brand": "Aशā",
        "color": "Black",
        "material": "Georgette",
        "sizes_available": '["S", "M", "L", "XL"]',
        "gender": "Women"
    }
]

def add_products():
    """Add sample products to the database"""
    print("🚀 Adding sample products to Aशā store...")
    
    success_count = 0
    for i, product in enumerate(sample_products, 1):
        try:
            # Add SKU for each product
            product["sku"] = f"ASHA-{i:03d}"
            
            # Create product via API
            response = requests.post(
                f"{BASE_URL}/api/products-with-images",
                data=product
            )
            
            if response.status_code == 200:
                print(f"✅ Added: {product['name']}")
                success_count += 1
            else:
                print(f"❌ Failed to add {product['name']}: {response.status_code}")
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Error adding {product['name']}: {str(e)}")
    
    print(f"\n🎊 Successfully added {success_count}/{len(sample_products)} products to your Aशā store!")
    
    if success_count > 0:
        print(f"\n✅ Your backend now has real products!")
        print(f"🌐 Visit http://localhost:3001 to see them on your website")
        print(f"📊 Visit http://localhost:8000/docs to see API documentation")

if __name__ == "__main__":
    add_products()
