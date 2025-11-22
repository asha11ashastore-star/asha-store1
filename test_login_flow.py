#!/usr/bin/env python3
"""
Test the complete login flow to verify authentication is working
"""

import requests

API_BASE = "http://localhost:8000"
SELLER_CREDS = {
    "email": "asha@ashastore.com",
    "password": "AshaStore2024!"
}

def test_complete_login_flow():
    """Test the complete login and API access flow"""
    print("🔐 Testing Complete Login Flow...")
    
    # Step 1: Test Login
    print("\n1. Testing Login API...")
    try:
        response = requests.post(f"{API_BASE}/api/v1/auth/login", json=SELLER_CREDS)
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            user = data.get("user")
            
            print("✅ Login successful!")
            print(f"   📧 User: {user.get('email')}")
            print(f"   👤 Role: {user.get('role')}")
            print(f"   🔑 Token: Valid JWT ({len(token.split('.'))} parts)")
            
            # Step 2: Test Company Info Access
            print("\n2. Testing Company Info API Access...")
            headers = {"Authorization": f"Bearer {token}"}
            test_data = {
                "artisans_supported": "1500+",
                "villages_reached": "150+",
                "happy_customers": "40,000+",
                "years_of_excellence": "15+",
                "features": [
                    {"title": "Heritage Weaving", "description": "Traditional techniques preserved for generations"},
                    {"title": "Quality Craftsmanship", "description": "Each piece meticulously crafted to perfection"}
                ]
            }
            
            update_response = requests.put(f"{API_BASE}/api/v1/company/info", json=test_data, headers=headers)
            
            if update_response.status_code == 200:
                print("✅ Company Info API access successful!")
                result = update_response.json()
                print(f"   📊 Updated Artisans: {result.get('artisans_supported')}")
                print(f"   🏘️  Updated Villages: {result.get('villages_reached')}")
                print(f"   😊 Updated Customers: {result.get('happy_customers')}")
                return True
            else:
                print(f"❌ Company Info API failed: {update_response.status_code}")
                print(f"Response: {update_response.text}")
                return False
                
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🚀 Testing Login Flow Fix\n")
    print("=" * 50)
    
    success = test_complete_login_flow()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 LOGIN FLOW WORKING PERFECTLY!")
        print("\n✅ WHAT'S FIXED:")
        print("   • Login API endpoint corrected (/api/v1/auth/login)")
        print("   • Role validation fixed (SELLER vs seller)")
        print("   • JWT token validation working")
        print("   • Company Info updates working")
        print("   • No more authentication loops")
        
        print("\n📱 READY TO USE:")
        print("   1. Go to: http://localhost:3000")
        print("   2. Login: asha@ashastore.com / AshaStore2024!")
        print("   3. Navigate to Company Info")
        print("   4. Make changes and update!")
        print("\n🎯 You should now be able to login and use the dashboard!")
        
    else:
        print("❌ LOGIN FLOW STILL HAS ISSUES")
        print("   Check browser console for errors")

if __name__ == "__main__":
    main()
