#!/usr/bin/env python3
"""Add sample products to the database"""

import requests
import json

API_BASE = "https://asha-store-backend.onrender.com"

# First, get auth token (you'll need to login first)
print("🔐 Login to get token...")
login_response = requests.post(
    f"{API_BASE}/api/v1/auth/login",
    json={
        "email": "asha@ashastore.com",
        "password": "AshaStore2024!"
    }
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.text}")
    exit(1)

token = login_response.json()["access_token"]
print(f"✅ Logged in successfully!")

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Sample products
sample_products = [
    {
        "name": "Beautiful Handloom Saree",
        "description": "Exquisite handwoven saree crafted by skilled artisans",
        "price": 5000,
        "category": "handloom_saree",
        "sku": "HL-001",
        "stock_quantity": 10,
        "is_active": True
    },
    {
        "name": "Traditional Kantha Saree",
        "description": "Authentic Kantha work saree with intricate embroidery",
        "price": 4500,
        "category": "kantha_saree",
        "sku": "KN-001",
        "stock_quantity": 8,
        "is_active": True
    },
    {
        "name": "Premium Batik Saree",
        "description": "Hand-dyed batik saree with beautiful patterns",
        "price": 3500,
        "category": "batik_saree",
        "sku": "BT-001",
        "stock_quantity": 12,
        "is_active": True
    },
    {
        "name": "Elegant Jamdani Saree",
        "description": "Traditional Jamdani weave saree",
        "price": 6000,
        "category": "jamdani_saree",
        "sku": "JM-001",
        "stock_quantity": 5,
        "is_active": True
    },
    {
        "name": "Shibori Tie-Dye Saree",
        "description": "Beautiful tie-dye saree with unique patterns",
        "price": 3000,
        "category": "shibori_saree",
        "sku": "SH-001",
        "stock_quantity": 15,
        "is_active": True
    }
]

print(f"\n📦 Adding {len(sample_products)} sample products...\n")

for i, product in enumerate(sample_products, 1):
    print(f"{i}. Adding: {product['name']}")
    response = requests.post(
        f"{API_BASE}/api/v1/products",
        headers=headers,
        json=product
    )
    
    if response.status_code == 200 or response.status_code == 201:
        print(f"   ✅ Added successfully!")
    else:
        print(f"   ❌ Failed: {response.text}")

print(f"\n✅ Done! Check your website now!")
print(f"\nGo to: https://customer-website-lovat.vercel.app/collections")
print(f"You should see {len(sample_products)} products!")
