#!/usr/bin/env python3
"""
Test script to verify login functionality works
"""
import requests
import json

def test_login():
    """Test the login endpoint"""
    
    url = "http://localhost:8000/api/v1/auth/login"
    
    # Test credentials
    credentials = {
        "email": "owner@clothingstore.com",
        "password": "password123"
    }
    
    try:
        print(f"Testing login at: {url}")
        print(f"Credentials: {credentials['email']} / {credentials['password']}")
        
        response = requests.post(
            url,
            json=credentials,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            print(f"Access Token: {data.get('access_token', 'Not found')[:50]}...")
            print(f"User: {data.get('user', {}).get('email', 'Not found')}")
        else:
            print("❌ Login failed!")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
