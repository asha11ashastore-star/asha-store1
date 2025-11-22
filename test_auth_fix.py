#!/usr/bin/env python3
"""
Test the authentication fix for Company Info updates
"""

import requests
import json

API_BASE = "http://localhost:8000"
SELLER_CREDS = {
    "email": "asha@ashastore.com",
    "password": "AshaStore2024!"
}

def test_jwt_token_format():
    """Test that we get a proper JWT token from login"""
    print("🔐 Testing JWT Token Format...")
    
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=SELLER_CREDS)
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            
            if token:
                # Check JWT format (3 parts separated by dots)
                parts = token.split('.')
                if len(parts) == 3:
                    print("✅ Valid JWT token received!")
                    print(f"   Token format: {len(parts)} parts (header.payload.signature)")
                    print(f"   Token sample: {token[:20]}...{token[-20:]}")
                    return token
                else:
                    print(f"❌ Invalid JWT token format: {len(parts)} parts (expected 3)")
                    return None
            else:
                print("❌ No access token in response")
                return None
        else:
            print(f"❌ Login failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_company_info_update_with_jwt(token):
    """Test company info update with valid JWT token"""
    print("\n📊 Testing Company Info Update with Valid JWT...")
    
    test_data = {
        "artisans_supported": "1200+",
        "villages_reached": "120+",
        "happy_customers": "30,000+", 
        "years_of_excellence": "12+",
        "features": [
            {"title": "Authentic Handloom", "description": "Traditional weaving techniques passed down generations"},
            {"title": "Quality Assurance", "description": "Each piece carefully inspected for perfection"},
            {"title": "Fair Trade", "description": "Supporting artisan communities with fair wages"},
            {"title": "Eco-Friendly", "description": "Sustainable practices protecting our environment"}
        ]
    }
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.put(f"{API_BASE}/api/v1/company/info", json=test_data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Company info update successful!")
            print(f"   📊 Artisans: {result.get('artisans_supported')}")
            print(f"   🏘️  Villages: {result.get('villages_reached')}")
            print(f"   😊 Customers: {result.get('happy_customers')}")
            print(f"   📅 Years: {result.get('years_of_excellence')}")
            print(f"   🌟 Features: {len(result.get('features', []))} items")
            return True
        elif response.status_code == 401:
            print("❌ Authentication failed (401 Unauthorized)")
            print("   This means the JWT token is still invalid")
            return False
        else:
            print(f"❌ Update failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Update error: {e}")
        return False

def main():
    print("🚀 Testing Authentication Fix for Company Info\n")
    print("=" * 60)
    print("Verifying fix for: JWT Error: Not enough segments")
    print("=" * 60)
    
    # Step 1: Test JWT token format
    token = test_jwt_token_format()
    if not token:
        print("\n❌ JWT token test failed - authentication fix needed")
        return
    
    # Step 2: Test Company Info update with JWT
    update_success = test_company_info_update_with_jwt(token)
    
    # Summary
    print("\n" + "=" * 60)
    if update_success:
        print("🎉 AUTHENTICATION FIX SUCCESSFUL!")
        print("\n✅ VERIFIED:")
        print("   • Valid JWT token format ✅")
        print("   • Company Info API accepts token ✅") 
        print("   • Updates work without 401 errors ✅")
        print("   • No more 'Not enough segments' error ✅")
        
        print("\n📱 SELLER DASHBOARD READY:")
        print("   • Login works with real JWT tokens")
        print("   • Company Info updates function properly")
        print("   • No more automatic logout issues")
        
        print("\n🔗 Try now: http://localhost:3000/dashboard/company-info")
    else:
        print("❌ AUTHENTICATION FIX NEEDS MORE WORK")
        print("   Check seller dashboard login process")

if __name__ == "__main__":
    main()
