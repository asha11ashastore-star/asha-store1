#!/usr/bin/env python3
"""
Debug why uploaded images aren't showing on customer website
"""

import requests
import json

API_BASE = "http://localhost:8000"

def debug_image_display():
    """Check what's wrong with image display"""
    print("🔍 Debugging Image Display Issue...")
    
    # Step 1: Get products from API
    print("\n1️⃣ Checking products in API...")
    
    try:
        response = requests.get(f"{API_BASE}/api/v1/products")
        
        if response.status_code == 200:
            data = response.json()
            products = data.get('items', data) if isinstance(data, dict) else data
            
            print(f"✅ Found {len(products)} products")
            
            for product in products:
                print(f"\n📦 Product: {product.get('name')} (ID: {product.get('id')})")
                print(f"   📸 Images field: {product.get('images', 'NOT PRESENT')}")
                
                if product.get('images'):
                    for i, img in enumerate(product['images']):
                        print(f"   🖼️  Image {i+1}:")
                        print(f"      URL: {img.get('image_url')}")
                        print(f"      Alt: {img.get('alt_text')}")
                        print(f"      Primary: {img.get('is_primary')}")
                        
                        # Test if image URL is accessible
                        if img.get('image_url'):
                            full_url = f"{API_BASE}{img['image_url']}" if img['image_url'].startswith('/') else img['image_url']
                            try:
                                img_response = requests.get(full_url, timeout=5)
                                print(f"      📡 Accessible: {img_response.status_code == 200} (Status: {img_response.status_code})")
                            except Exception as e:
                                print(f"      ❌ Error accessing image: {e}")
                else:
                    print("   ⚠️  No images found for this product")
        else:
            print(f"❌ API call failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Step 2: Check individual product API
    print(f"\n2️⃣ Checking individual product API...")
    
    try:
        # Try to get the first product individually
        response = requests.get(f"{API_BASE}/api/v1/products")
        if response.status_code == 200:
            data = response.json()
            products = data.get('items', data) if isinstance(data, dict) else data
            
            if products:
                product_id = products[0].get('id')
                
                detail_response = requests.get(f"{API_BASE}/api/v1/products/{product_id}")
                if detail_response.status_code == 200:
                    product_detail = detail_response.json()
                    print(f"✅ Individual product API working")
                    print(f"   📸 Images in detail: {product_detail.get('images', 'NOT PRESENT')}")
                    
                    # Check images endpoint
                    images_response = requests.get(f"{API_BASE}/api/v1/products/{product_id}/images")
                    if images_response.status_code == 200:
                        images = images_response.json()
                        print(f"   📸 Images endpoint: {len(images)} images found")
                        for img in images:
                            print(f"      🔗 URL: {img.get('image_url')}")
                    else:
                        print(f"   ❌ Images endpoint failed: {images_response.status_code}")
                        
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Step 3: Check static file serving
    print(f"\n3️⃣ Testing static file serving...")
    
    try:
        # Test a direct uploads URL
        test_url = f"{API_BASE}/uploads/"
        response = requests.get(test_url)
        print(f"📡 Uploads directory accessible: {response.status_code}")
        
    except Exception as e:
        print(f"❌ Error testing static files: {e}")

def main():
    print("🚀 Image Display Debug Tool\n")
    print("=" * 50)
    print("🔧 CHECKING:")
    print("   1. Products API response structure")
    print("   2. Image URLs and accessibility") 
    print("   3. Static file serving")
    print("   4. Frontend image display logic")
    print("=" * 50)
    
    debug_image_display()
    
    print("\n" + "=" * 50)
    print("💡 POSSIBLE ISSUES:")
    print("   • Image URLs not properly constructed")
    print("   • Static file serving not working")
    print("   • Frontend not handling image URLs correctly")
    print("   • CORS issues with image loading")
    print("   • Database not saving image records")

if __name__ == "__main__":
    main()
