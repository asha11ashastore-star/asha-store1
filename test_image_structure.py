#!/usr/bin/env python3
"""
Test image structure in API responses
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_image_structure():
    """Check how images are structured in the API response"""
    print("🔍 Testing Image Structure...")
    
    # Login
    login_data = {
        "email": "asha@ashastore.com",
        "password": "AshaStore2024!"
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=login_data)
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ Authentication successful!")
        
    except Exception as e:
        print(f"❌ Authentication failed: {e}")
        return
    
    # Create a test product
    test_product = {
        "name": "Image Test Product",
        "description": "Testing image display",
        "category": "silk_saree", 
        "price": 3000.00,
        "stock_quantity": 5,
        "sku": "IMG001",
        "status": "active"
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/products", json=test_product, headers=headers)
        if response.status_code == 200:
            product = response.json()
            product_id = product.get('id')
            print(f"✅ Product created: ID {product_id}")
            
            # Check product structure
            print(f"\n📦 Product Structure:")
            print(f"   ID: {product.get('id')}")
            print(f"   Name: {product.get('name')}")
            print(f"   Images field: {product.get('images', 'NOT PRESENT')}")
            
            # Check individual product API
            detail_response = requests.get(f"{API_BASE}/api/v1/products/{product_id}")
            if detail_response.status_code == 200:
                detail_product = detail_response.json()
                print(f"\n📋 Detail API Structure:")
                print(f"   Images field: {detail_product.get('images', 'NOT PRESENT')}")
                
                # Check if images is a relationship that needs to be loaded
                print(f"   All fields: {list(detail_product.keys())}")
                
            # Check images endpoint
            images_response = requests.get(f"{API_BASE}/api/v1/products/{product_id}/images", headers=headers)
            if images_response.status_code == 200:
                images = images_response.json()
                print(f"\n🖼️ Images Endpoint:")
                print(f"   Images count: {len(images)}")
                print(f"   Images structure: {images}")
            else:
                print(f"\n🖼️ Images Endpoint: {images_response.status_code} - {images_response.text}")
                
        else:
            print(f"❌ Product creation failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_image_structure()
