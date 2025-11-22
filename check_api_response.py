#!/usr/bin/env python3
"""
Check exact API response structure
"""

import requests
import json

API_BASE = "http://localhost:8000"

def check_api_response():
    """Check exact API response"""
    print("🔍 Checking exact API response structure...")
    
    try:
        response = requests.get(f"{API_BASE}/api/v1/products")
        
        if response.status_code == 200:
            data = response.json()
            print("📡 Raw API Response:")
            print(json.dumps(data, indent=2, default=str))
        else:
            print(f"❌ API failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_api_response()
