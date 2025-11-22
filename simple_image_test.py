#!/usr/bin/env python3
"""
Simple image upload test
"""

import requests
import json
from io import BytesIO
from PIL import Image

API_BASE = "http://localhost:8000"

def simple_test():
    print("🔧 Simple Image Upload Test")
    
    # Login
    login_data = {"email": "asha@ashastore.com", "password": "AshaStore2024!"}
    response = requests.post(f"{API_BASE}/api/v1/auth/login", json=login_data)
    token = response.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    print("✅ Logged in")
    
    # Create product
    product_data = {
        "name": "Simple Test Product",
        "description": "Testing upload",
        "category": "silk_saree",
        "price": 1000.0,
        "stock_quantity": 1,
        "sku": "SIMPLE001",
        "status": "active"
    }
    
    response = requests.post(f"{API_BASE}/api/v1/products", json=product_data, headers=headers)
    product_id = response.json().get("id")
    print(f"✅ Created product: {product_id}")
    
    # Create simple image
    img = Image.new('RGB', (50, 50), color='blue')
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    
    # Upload image
    files = {'files': ('test.png', img_bytes, 'image/png')}
    response = requests.post(f"{API_BASE}/api/v1/products/{product_id}/images", files=files, headers=headers)
    
    print(f"📡 Upload status: {response.status_code}")
    print(f"📄 Response: {response.text}")
    
    if response.status_code == 200:
        print("🎉 SUCCESS - Image upload working!")
        
        # Test image URL
        images = response.json()
        if images:
            image_url = f"http://localhost:8000{images[0]['url']}"
            img_response = requests.get(image_url)
            print(f"📸 Image accessible: {img_response.status_code == 200}")
            print(f"🔗 Image URL: {image_url}")
    else:
        print("❌ FAILED - Image upload not working")

if __name__ == "__main__":
    simple_test()
