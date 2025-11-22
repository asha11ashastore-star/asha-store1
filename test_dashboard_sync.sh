#!/bin/bash

echo "=== Testing Dashboard vs Customer Website Sync ==="
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

# Get dashboard products
echo "2. Getting dashboard products..."
DASHBOARD=$(curl -s "http://localhost:8000/api/v1/products-dashboard?limit=100" \
  -H "Authorization: Bearer $TOKEN")

DASHBOARD_COUNT=$(echo $DASHBOARD | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('total', 0))" 2>/dev/null)
echo "Dashboard products: $DASHBOARD_COUNT"
echo ""

# Get customer website products  
echo "3. Getting customer website products..."
CUSTOMER=$(curl -s "http://localhost:8000/api/v1/products-fixed/?limit=100")

CUSTOMER_COUNT=$(echo $CUSTOMER | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('total', 0))" 2>/dev/null)
echo "Customer website products: $CUSTOMER_COUNT"
echo ""

# Compare
echo "=== COMPARISON ==="
echo "Dashboard: $DASHBOARD_COUNT products"
echo "Customer:  $CUSTOMER_COUNT products"
echo ""

if [ "$DASHBOARD_COUNT" != "$CUSTOMER_COUNT" ]; then
  echo "❌ MISMATCH DETECTED!"
  echo ""
  echo "Dashboard response:"
  echo $DASHBOARD | python3 -m json.tool | head -50
else
  echo "✓ Synchronized!"
fi
