#!/bin/bash

echo "🧪 Testing Order Management System..."
echo ""

# Test creating an order
echo "📝 Creating test order..."
ORDER_RESPONSE=$(curl -s -X POST http://localhost:8000/api/v1/guest-orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test Customer",
    "customer_email": "test@example.com",
    "customer_phone": "9876543210",
    "customer_address": "123 Test Street, Mumbai, Maharashtra, 400001",
    "items": [
      {
        "product_id": 15,
        "product_name": "Test Saree for Validation",
        "quantity": 1,
        "price": 2500
      }
    ],
    "total_amount": 2500,
    "payment_method": "manual",
    "notes": "Test order from script"
  }')

echo "✅ Order created:"
echo "$ORDER_RESPONSE" | python3 -m json.tool
echo ""

# Get order number
ORDER_NUMBER=$(echo "$ORDER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['order_number'])" 2>/dev/null)

if [ ! -z "$ORDER_NUMBER" ]; then
  echo "✅ Order Number: $ORDER_NUMBER"
  echo ""
  echo "📋 Now:"
  echo "1. Go to http://localhost:3000"
  echo "2. Login: asha@ashastore.com / AshaStore2024!"
  echo "3. Click 'Orders' in sidebar"
  echo "4. Look for order: $ORDER_NUMBER"
  echo "5. Click 'View Details' to see full receipt!"
else
  echo "❌ Failed to create order"
  echo "Response: $ORDER_RESPONSE"
fi

echo ""
echo "🎉 Test complete!"
