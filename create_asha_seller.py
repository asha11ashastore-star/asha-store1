#!/usr/bin/env python3
"""
Create Asha seller account in production database
"""
import requests
import json

# Production backend URL
BASE_URL = "https://asha-store-backend.onrender.com"

def create_seller():
    """Create the seller account"""
    
    # Registration data
    seller_data = {
        "first_name": "Asha",
        "last_name": "Dhaundiyal",
        "username": "asha",
        "email": "asha@ashastore.com",
        "password": "AshaStore2024!",
        "role": "seller"
    }
    
    print("🔧 Creating seller account...")
    print(f"Email: {seller_data['email']}")
    print(f"Password: {seller_data['password']}")
    print()
    
    try:
        # Try to register
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register",
            json=seller_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("\n✅ Seller account created successfully!")
            print("\nYou can now login with:")
            print(f"Email: {seller_data['email']}")
            print(f"Password: {seller_data['password']}")
        elif response.status_code == 400:
            data = response.json()
            if "already exists" in data.get("detail", "").lower():
                print("\n⚠️  Account already exists!")
                print("Trying to login to verify password...")
                
                # Try login
                login_response = requests.post(
                    f"{BASE_URL}/api/v1/auth/login",
                    json={
                        "email": seller_data['email'],
                        "password": seller_data['password']
                    }
                )
                
                if login_response.status_code == 200:
                    print("✅ Login successful! Password is correct.")
                    print("You can use these credentials in the dashboard.")
                else:
                    print("❌ Login failed! The password might be different.")
                    print("You may need to reset the password in the database.")
            else:
                print(f"\n❌ Error: {data.get('detail', 'Unknown error')}")
        else:
            print(f"\n❌ Failed with status {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    create_seller()
