#!/bin/bash

echo "=== Testing Product Detail Endpoint for Edit ==="
echo ""

# Login to get token
echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "asha@ashastore.com", "password": "AshaStore2024!"}')

TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "ERROR: Could not get token"
  exit 1
fi

echo "✓ Token obtained"
echo ""

# Get product detail
echo "2. Fetching product ID 15 details..."
PRODUCT=$(curl -s "http://localhost:8000/api/v1/products/15" \
  -H "Authorization: Bearer $TOKEN")

echo "Product response:"
echo $PRODUCT | python3 -m json.tool | head -30

# Check if successful
if echo $PRODUCT | grep -q '"id"'; then
  echo ""
  echo "✅ SUCCESS! Product details fetched correctly"
else
  echo ""
  echo "❌ FAILED! Could not fetch product details"
  echo "Full response:"
  echo $PRODUCT
fi
