#!/usr/bin/env python3
"""
Test the dashboard products endpoint
"""

import requests

# Login as Asha first
login_response = requests.post("http://localhost:8000/api/v1/auth/login", json={
    "email": "asha@ashastore.com",
    "password": "AshaStore2024!"
})

if login_response.status_code == 200:
    token = login_response.json()['access_token']
    print("✅ Logged in as Asha")
    
    # Test dashboard endpoint
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get("http://localhost:8000/api/v1/products/dashboard", headers=headers)
    
    print(f"Dashboard endpoint status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Dashboard endpoint works!")
        print(f"Total products: {data.get('total', 0)}")
        print(f"Products returned: {len(data.get('items', []))}")
        
        for product in data.get('items', [])[:5]:
            print(f"  - {product['name']} (Stock: {product.get('stock_quantity', 0)}, Status: {product.get('status')})")
    else:
        print(f"❌ Dashboard endpoint failed: {response.text}")
else:
    print(f"❌ Login failed: {login_response.text}")
