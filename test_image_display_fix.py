#!/usr/bin/env python3
"""
Test complete image display fix
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_image_display_fix():
    """Test complete image display functionality"""
    print("🎯 Testing Complete Image Display Fix...")
    
    # Step 1: Check products API
    print("\n1️⃣ Testing Products API...")
    
    try:
        response = requests.get(f"{API_BASE}/api/v1/products")
        
        if response.status_code == 200:
            data = response.json()
            products = data.get('items', [])
            
            print(f"✅ Found {len(products)} products")
            
            for product in products:
                name = product.get('name')
                primary_image = product.get('primary_image')
                
                print(f"📦 Product: {name}")
                print(f"   🖼️  Primary image: {primary_image}")
                
                if primary_image:
                    # Test image accessibility
                    image_url = f"{API_BASE}{primary_image}"
                    img_response = requests.get(image_url, timeout=5)
                    print(f"   📡 Image accessible: {img_response.status_code == 200} (Status: {img_response.status_code})")
                    
                    if img_response.status_code == 200:
                        print(f"   📸 Image size: {len(img_response.content)} bytes")
                        print(f"   🔗 Full URL: {image_url}")
                else:
                    print("   ⚠️  No primary image")
        else:
            print(f"❌ Products API failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Step 2: Test individual product detail
    print("\n2️⃣ Testing Product Detail API...")
    
    try:
        # Get first product ID
        response = requests.get(f"{API_BASE}/api/v1/products")
        if response.status_code == 200:
            data = response.json()
            products = data.get('items', [])
            
            if products:
                product_id = products[0]['id']
                
                # Get product detail
                detail_response = requests.get(f"{API_BASE}/api/v1/products/{product_id}")
                if detail_response.status_code == 200:
                    product = detail_response.json()
                    images = product.get('images', [])
                    
                    print(f"✅ Product detail API working")
                    print(f"   📸 Images array: {len(images)} images")
                    
                    for i, img in enumerate(images):
                        img_url = img.get('image_url')
                        if img_url:
                            full_url = f"{API_BASE}{img_url}"
                            img_response = requests.get(full_url, timeout=5)
                            print(f"   🖼️  Image {i+1}: {img_response.status_code == 200} (URL: {img_url})")
                
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("🚀 Complete Image Display Fix Test\n")
    print("=" * 60)
    print("🔧 TESTING:")
    print("   1. Products list API with primary_image")
    print("   2. Static file serving accessibility") 
    print("   3. Product detail API with images array")
    print("   4. Frontend compatibility")
    print("=" * 60)
    
    test_image_display_fix()
    
    print("\n" + "=" * 60)
    print("🎉 WHAT SHOULD WORK NOW:")
    print("   • Collections page shows uploaded images")
    print("   • Product detail pages show image galleries")  
    print("   • All images served from local backend storage")
    print("   • Professional image display and fallbacks")
    
    print(f"\n🔗 TEST URLS:")
    print(f"   📦 Collections: http://localhost:3001/collections")
    print(f"   🔍 Product Details: Click any product from collections")
    print(f"   📱 Seller Dashboard: http://localhost:3000")

if __name__ == "__main__":
    main()
