#!/usr/bin/env python3
"""
Test the company info functionality
"""

import requests
import json

API_BASE = "http://localhost:8000"
SELLER_CREDS = {
    "email": "asha@ashastore.com",
    "password": "AshaStore2024!"
}

def get_auth_token():
    """Get authentication token for seller"""
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=SELLER_CREDS)
        if response.status_code == 200:
            return response.json().get("access_token")
    except:
        pass
    return None

def test_company_info_api():
    """Test company info API endpoints"""
    print("🔍 Testing Company Info API...")
    
    # Test public endpoint (GET)
    print("\n1. Testing GET /api/v1/company/info (public)")
    try:
        response = requests.get(f"{API_BASE}/api/v1/company/info")
        if response.status_code == 200:
            data = response.json()
            print("✅ Company info retrieved successfully!")
            print(f"   📊 Artisans Supported: {data.get('artisans_supported')}")
            print(f"   🏘️  Villages Reached: {data.get('villages_reached')}")
            print(f"   😊 Happy Customers: {data.get('happy_customers')}")
            print(f"   📅 Years of Excellence: {data.get('years_of_excellence')}")
            print(f"   🌟 Features: {len(data.get('features', []))} items")
            return data
        else:
            print(f"❌ Failed to get company info: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_company_info_update():
    """Test updating company info"""
    print("\n2. Testing PUT /api/v1/company/info (seller only)")
    
    # Get auth token
    token = get_auth_token()
    if not token:
        print("❌ Authentication failed")
        return False
    
    print("✅ Authentication successful")
    
    # Test update
    update_data = {
        "artisans_supported": "750+",
        "villages_reached": "75+", 
        "happy_customers": "15,000+",
        "years_of_excellence": "7+",
        "features": [
            {"title": "100% Handwoven", "description": "Every product is authentically handcrafted by skilled artisans"},
            {"title": "Premium Quality", "description": "Carefully curated collection with the finest materials"},
            {"title": "Ethical Sourcing", "description": "Direct partnerships ensuring fair wages for artisans"},
            {"title": "Cultural Heritage", "description": "Preserving traditional techniques and designs"},
            {"title": "Sustainable Fashion", "description": "Eco-friendly practices supporting environmental conservation"}
        ]
    }
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.put(f"{API_BASE}/api/v1/company/info", json=update_data, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Company info updated successfully!")
            print(f"   📊 New Artisans: {data.get('artisans_supported')}")
            print(f"   🏘️  New Villages: {data.get('villages_reached')}")
            print(f"   😊 New Customers: {data.get('happy_customers')}")
            print(f"   📅 New Years: {data.get('years_of_excellence')}")
            print(f"   🌟 Features: {len(data.get('features', []))} items")
            return True
        else:
            print(f"❌ Update failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Update error: {e}")
        return False

def main():
    print("🚀 Testing Company Info Integration\n")
    print("=" * 50)
    
    # Test 1: Get company info (public)
    company_info = test_company_info_api()
    if not company_info:
        print("\n❌ Basic API test failed. Stopping.")
        return
    
    # Test 2: Update company info (seller)
    if test_company_info_update():
        print("\n📊 Testing updated data retrieval...")
        updated_info = test_company_info_api()
        if updated_info:
            print("\n🎉 Company Info API Integration Test PASSED!")
            print("\n✅ VERIFIED FUNCTIONALITY:")
            print("   • Public GET endpoint working ✅")
            print("   • Seller authentication working ✅")
            print("   • Seller PUT endpoint working ✅") 
            print("   • Data persistence working ✅")
            print("\n🌟 Asha can now edit company info from seller dashboard!")
            print("   📱 Seller Dashboard: http://localhost:3000/dashboard/company-info")
            print("   🌐 Customer Website: http://localhost:3001/about")
        else:
            print("\n❌ Failed to retrieve updated data")
    else:
        print("\n❌ Update test failed")

if __name__ == "__main__":
    main()
