#!/bin/bash

echo "=== Testing Razorpay Payment Link Integration ==="
echo ""

echo "1. Testing Simple Payment Link Creation..."
echo ""

# Test simple payment link for product ID 15
RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/payment-link/create-simple" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 15}')

echo "Response:"
echo $RESPONSE | python3 -m json.tool

# Extract payment URL
PAYMENT_URL=$(echo $RESPONSE | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('payment_url', 'ERROR'))" 2>/dev/null)

if [ "$PAYMENT_URL" != "ERROR" ] && [ ! -z "$PAYMENT_URL" ]; then
  echo ""
  echo "✅ SUCCESS! Payment link created"
  echo ""
  echo "==================== PAYMENT URL ===================="
  echo "$PAYMENT_URL"
  echo "===================================================="
  echo ""
  echo "📋 How to test:"
  echo "1. Copy the payment URL above"
  echo "2. Open it in your browser"
  echo "3. Verify the amount is pre-filled and matches product price"
  echo "4. Try to edit the amount - it should be LOCKED"
  echo ""
  echo "💡 The URL will look like:"
  echo "https://razorpay.me/@ashadhaundiyal?amount=3000&purpose=Image%20Test%20Product"
  echo ""
else
  echo ""
  echo "❌ FAILED! Could not create payment link"
  echo "Check if backend is running: http://localhost:8000/health"
fi
