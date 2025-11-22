#!/usr/bin/env python3
"""
Debug image upload functionality
"""

import requests
import json
from io import BytesIO
from PIL import Image
import os

API_BASE = "http://localhost:8000"

def create_test_image():
    """Create a small test image"""
    # Create a simple 100x100 red square image
    img = Image.new('RGB', (100, 100), color='red')
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def debug_image_upload():
    """Debug the image upload process"""
    print("🔍 Debugging Image Upload Issues...")
    
    # Step 1: Login
    print("\n1️⃣ Authentication...")
    login_data = {
        "email": "asha@ashastore.com",
        "password": "AshaStore2024!"
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=login_data)
        if response.status_code != 200:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return
            
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ Authentication successful!")
        
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return
    
    # Step 2: Create a test product
    print("\n2️⃣ Creating test product...")
    test_product = {
        "name": "Image Upload Test Product",
        "description": "Testing image upload functionality",
        "category": "silk_saree",
        "price": 2500.00,
        "stock_quantity": 3,
        "sku": "IMGTEST001",
        "status": "active"
    }
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/products", json=test_product, headers=headers)
        if response.status_code != 200:
            print(f"❌ Product creation failed: {response.status_code} - {response.text}")
            return
            
        product = response.json()
        product_id = product.get('id')
        print(f"✅ Product created: ID {product_id}")
        
    except Exception as e:
        print(f"❌ Product creation error: {e}")
        return
    
    # Step 3: Test image upload endpoint
    print(f"\n3️⃣ Testing image upload to product {product_id}...")
    
    try:
        # Create test image
        test_image = create_test_image()
        
        # Prepare files for upload
        files = {'files': ('test_image.png', test_image, 'image/png')}
        
        # Upload image
        response = requests.post(
            f"{API_BASE}/api/v1/products/{product_id}/images", 
            files=files, 
            headers=headers
        )
        
        print(f"📡 Upload response status: {response.status_code}")
        print(f"📡 Upload response headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Image upload successful!")
            print(f"   📸 Images uploaded: {len(result)}")
            print(f"   📄 Response: {result}")
        else:
            print(f"❌ Image upload failed: {response.status_code}")
            print(f"   📄 Error response: {response.text}")
            
        # Test getting images back
        get_response = requests.get(f"{API_BASE}/api/v1/products/{product_id}/images", headers=headers)
        if get_response.status_code == 200:
            images = get_response.json()
            print(f"✅ Retrieved {len(images)} images from API")
        else:
            print(f"⚠️  Failed to retrieve images: {get_response.status_code}")
            
    except Exception as e:
        print(f"❌ Image upload test error: {e}")
        import traceback
        traceback.print_exc()
    
    # Step 4: Check storage service configuration
    print(f"\n4️⃣ Checking storage configuration...")
    
    try:
        # Check if backend has proper storage configuration
        health_response = requests.get(f"{API_BASE}/health")
        if health_response.status_code == 200:
            print("✅ Backend is healthy")
        else:
            print(f"⚠️  Backend health check failed: {health_response.status_code}")
            
    except Exception as e:
        print(f"❌ Health check error: {e}")

def main():
    print("🚀 Image Upload Debug Tool\n")
    print("=" * 50)
    print("🔧 DEBUGGING:")
    print("   1. Authentication system")
    print("   2. Product creation")
    print("   3. Image upload endpoint")
    print("   4. Storage service configuration")
    print("=" * 50)
    
    debug_image_upload()
    
    print("\n" + "=" * 50)
    print("💡 COMMON IMAGE UPLOAD ISSUES:")
    print("   • Storage service (Cloudinary) not configured")
    print("   • File size/format validation failing")
    print("   • Authentication token issues")
    print("   • CORS policy blocking uploads")
    print("   • Backend storage service errors")
    
    print("\n📋 CHECK THESE:")
    print("   1. Backend logs for storage errors")
    print("   2. Cloudinary API keys in environment")
    print("   3. File format and size limits")
    print("   4. Network connectivity")

if __name__ == "__main__":
    main()
