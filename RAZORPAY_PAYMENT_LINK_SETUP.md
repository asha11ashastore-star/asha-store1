# Razorpay Payment Link Integration for Asha Store

## Your Razorpay Payment Link
https://razorpay.me/@ashadhaundiyal

## Goal
When customers click "Pay", they should be redirected to your Razorpay payment link with:
- ✅ Product price automatically filled
- ✅ Amount LOCKED (customer cannot edit)
- ✅ No manual entry required

## Implementation Steps

### Option 1: Razorpay Payment Link with Pre-filled Amount

Razorpay Payment Links support URL parameters to pre-fill amounts:

```
https://razorpay.me/@ashadhaundiyal?amount=3500
```

**Parameters:**
- `amount` - Amount in rupees (e.g., 3500 for ₹3,500)
- The amount will be pre-filled and LOCKED

### Option 2: Create Dynamic Payment Links via API

For better control and non-editable amounts, use Razorpay API to create payment links:

1. **When customer clicks "Buy Now":**
   - Backend creates a payment link with fixed amount
   - Returns payment link URL to frontend
   - Customer is redirected to payment link

2. **Payment Link Properties:**
   - Amount is locked (cannot be edited)
   - Custom description includes product name
   - Expiry time can be set
   - Payment link is unique per order

## Quick Implementation

### Step 1: Update Backend to Create Payment Links

The backend will create unique payment links for each order with locked amounts.

### Step 2: Update Frontend "Buy Now" Button

When clicked, it will:
1. Create order in backend
2. Get payment link with locked amount
3. Redirect customer to Razorpay payment page

### Step 3: Handle Payment Success

After successful payment:
1. Razorpay sends webhook to backend
2. Order status updated to "Paid"
3. Customer receives confirmation

## Key Features

✅ **Amount is Locked** - Customer cannot edit the price
✅ **Automatic Calculation** - Price is taken from product
✅ **Secure** - Razorpay handles all payment processing
✅ **Professional** - Uses your branded payment link
✅ **Mobile Friendly** - Works on all devices

## Testing

Test URL format:
```
https://razorpay.me/@ashadhaundiyal?amount=3500&purpose=Silk%20Saree
```

Where:
- `amount=3500` → ₹3,500 (locked amount)
- `purpose=Silk%20Saree` → Product name in payment description

## What I'll Implement

1. **Payment Link Generator** - Creates unique links with locked amounts
2. **Buy Now Button** - Redirects to payment link
3. **Order Tracking** - Tracks payment status
4. **Webhook Handler** - Receives payment confirmations

Would you like me to implement this now?
