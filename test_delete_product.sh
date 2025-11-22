#!/bin/bash

# Test delete product endpoint
# First login to get token

echo "=== Testing Delete Product Endpoint ==="
echo ""

# Login to get token
echo "1. Logging in as Asha..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "asha@ashastore.com", "password": "AshaStore2024!"}')

echo "Login response: $LOGIN_RESPONSE"
echo ""

TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token. Trying alternative email..."
  LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "test@test.com", "password": "Test123!"}')
  
  TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)
fi

if [ -z "$TOKEN" ]; then
  echo "ERROR: Could not get authentication token"
  exit 1
fi

echo "Token obtained: ${TOKEN:0:20}..."
echo ""

# Try to delete product ID 21 (from the screenshot)
echo "2. Attempting to delete product ID 21..."
DELETE_RESPONSE=$(curl -s -X DELETE "http://localhost:8000/api/v1/products/21" \
  -H "Authorization: Bearer $TOKEN")

echo "Delete response: $DELETE_RESPONSE"
echo ""

# Check if product still exists
echo "3. Checking if product 21 still exists..."
PRODUCT_CHECK=$(curl -s "http://localhost:8000/api/v1/products-fixed/?limit=100" | python3 -c "import sys, json; data=json.load(sys.stdin); print([p for p in data['items'] if p['id']==21])")

echo "Product 21 check: $PRODUCT_CHECK"
