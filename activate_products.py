#!/usr/bin/env python3
"""
Activate products so they appear on customer website
"""

import requests

API_BASE = "http://localhost:8000"
SELLER_CREDENTIALS = {
    "email": "asha@ashastore.com",
    "password": "AshaStore2024!"
}

def get_auth_token():
    """Get authentication token"""
    try:
        response = requests.post(
            f"{API_BASE}/api/v1/auth/login",
            json=SELLER_CREDENTIALS,
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json().get("access_token")
        return None
    except:
        return None

def get_seller_products(auth_token):
    """Get products created by seller"""
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(
            f"{API_BASE}/api/v1/products",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json().get("items", [])
        return []
    except:
        return []

def activate_product(product_id, auth_token):
    """Activate a product to make it visible to customers"""
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.put(
            f"{API_BASE}/api/v1/products/{product_id}",
            headers=headers,
            json={"status": "active"},
            timeout=10
        )
        
        if response.status_code == 200:
            return True
        else:
            print(f"❌ Failed to activate product {product_id}: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error activating product {product_id}: {e}")
        return False

def main():
    print("🔄 Activating products for customer visibility...")
    
    # Get auth token
    auth_token = get_auth_token()
    if not auth_token:
        print("❌ Authentication failed")
        return
    
    print("✅ Authentication successful")
    
    # Get products
    products = get_seller_products(auth_token)
    print(f"📦 Found {len(products)} products")
    
    # Activate each product
    activated_count = 0
    for product in products:
        product_id = product.get("id")
        product_name = product.get("name")
        current_status = product.get("status")
        
        print(f"\n📋 Product: {product_name}")
        print(f"   ID: {product_id}")
        print(f"   Current Status: {current_status}")
        
        if current_status != "ACTIVE":
            if activate_product(product_id, auth_token):
                print(f"   ✅ Activated successfully!")
                activated_count += 1
            else:
                print(f"   ❌ Activation failed")
        else:
            print(f"   ⭐ Already active")
    
    print(f"\n🎉 Activation completed!")
    print(f"✅ {activated_count} products activated")
    print("\n🛒 Products should now be visible on customer website!")

if __name__ == "__main__":
    main()
