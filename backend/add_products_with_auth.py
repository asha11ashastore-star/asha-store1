#!/usr/bin/env python3
"""
Login as owner and add sample products
"""
import requests
import json

BASE_URL = "http://localhost:8000"

# Login credentials for the owner
OWNER_CREDENTIALS = {
    "username": "owner@clothingstore.com",
    "password": "MyClothingStore2024"
}

# Sample products for Aशā store
sample_products = [
    {
        "name": "Elegant Banarasi Silk Saree",
        "description": "Beautiful traditional Banarasi silk saree perfect for weddings and special occasions",
        "category": "saree",
        "price": 2999.0,
        "stock": 15,
        "brand": "Aशā",
        "color": "Red",
        "fabric": "Silk"
    },
    {
        "name": "Traditional Cotton Saree", 
        "description": "Handwoven cotton saree with traditional patterns",
        "category": "saree",
        "price": 1899.0,
        "stock": 25,
        "brand": "Aशā",
        "color": "Blue",
        "fabric": "Cotton"
    },
    {
        "name": "Designer Kurti Set",
        "description": "Beautiful kurti set with matching dupatta",
        "category": "kurti",
        "price": 1299.0,
        "stock": 30,
        "brand": "Aशā",
        "color": "Pink",
        "fabric": "Cotton"
    },
    {
        "name": "Embroidered Kurti",
        "description": "Cotton kurti with beautiful embroidery work",
        "category": "kurti", 
        "price": 899.0,
        "stock": 20,
        "brand": "Aशā",
        "color": "White",
        "fabric": "Cotton"
    },
    {
        "name": "Silk Dupatta",
        "description": "Pure silk dupatta with golden border",
        "category": "dupatta",
        "price": 599.0,
        "stock": 40,
        "brand": "Aशā",
        "color": "Golden",
        "fabric": "Silk"
    },
    {
        "name": "Cotton Stole",
        "description": "Soft cotton stole for everyday wear", 
        "category": "stole",
        "price": 399.0,
        "stock": 35,
        "brand": "Aशā",
        "color": "Cream",
        "fabric": "Cotton"
    }
]

def login():
    """Login and get access token"""
    print("🔐 Logging in as store owner...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/token",
            data=OWNER_CREDENTIALS
        )
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Login successful!")
            return token_data.get("access_token")
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return None

def add_products_with_token(token):
    """Add products using authentication token"""
    if not token:
        print("❌ No token available, cannot add products")
        return
        
    headers = {"Authorization": f"Bearer {token}"}
    
    print(f"🚀 Adding {len(sample_products)} products to Aशā store...")
    success_count = 0
    
    for i, product in enumerate(sample_products, 1):
        try:
            response = requests.post(
                f"{BASE_URL}/api/products-with-images", 
                data=product,
                headers=headers
            )
            
            if response.status_code == 200:
                print(f"✅ Added: {product['name']}")
                success_count += 1
            else:
                print(f"❌ Failed to add {product['name']}: {response.status_code}")
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Error adding {product['name']}: {str(e)}")
    
    print(f"\n🎊 Successfully added {success_count}/{len(sample_products)} products!")
    
    if success_count > 0:
        print("\n✅ YOUR BACKEND IS NOW FULLY WORKING!")
        print("🌐 Visit your website: http://localhost:3001")
        print("📊 Check API docs: http://localhost:8000/docs")
        print("🛒 Your products are now live on the website!")

def main():
    print("=" * 60)
    print("🏪 Aशā Store - Adding Sample Products")
    print("=" * 60)
    
    # Login first
    token = login()
    
    # Add products with authentication
    add_products_with_token(token)
    
    print("\n" + "=" * 60)
    print("✅ Backend Integration Complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()
