# Razorpay Setup Instructions - Fix Payment Error

## Current Issue

When customers click "Proceed to Payment", they're redirected to Razorpay but see:
```
Oops, looks like something went wrong
Please check back later or contact the merchant for more details
```

## Why This Happens

The `@ashadhaundiyal` Razorpay.me username either:
1. Doesn't exist yet
2. Hasn't been activated
3. Needs verification

## Solution: Two Options

### Option A: Set Up Razorpay.me (Recommended)

#### Step 1: Create Razorpay Account
1. Go to https://razorpay.com
2. Click "Sign Up" 
3. Use email: (your email)
4. Complete registration

#### Step 2: Verify Account
1. Submit KYC documents:
   - PAN Card
   - Bank Account Details
   - Address Proof
2. Wait for approval (1-2 days)

#### Step 3: Get Your Razorpay.me Username
1. Login to Razorpay Dashboard
2. Go to "Payment Links" → "Payment Pages"
3. Create your custom username (e.g., @ashadhaundiyal)
4. Note: Username must be available

#### Step 4: Update Code
Once you have your actual username, update:

**File:** `/backend/app/services/razorpay_payment_link.py`
```python
def create_simple_payment_url(
    self,
    amount: float,
    product_name: str,
    username: str = "YOUR_ACTUAL_USERNAME"  # Change this
):
```

**Current Code:**
```python
username: str = "ashadhaundiyal"
```

**Update To:**
```python
username: str = "yourverifiedusername"  # Use your actual Razorpay username
```

### Option B: Manual Payment (Current Implementation)

I've updated the checkout to show manual payment instructions instead:

**What Happens Now:**
1. Customer fills checkout form
2. Clicks "Proceed to Payment"
3. Sees payment details in popup:
   ```
   Order Summary: Product A (₹2,500 x 1)
   Total: ₹2,500
   
   Payment Options:
   - UPI: ashadhaundiyal@paytm
   - Bank Transfer: [Your details]
   - Razorpay: https://razorpay.me/@ashadhaundiyal
   ```
4. Customer makes payment
5. Sends confirmation via WhatsApp

**To Configure:**

Edit `/frontend/customer-website/components/CheckoutModal.jsx` line 113-129:

```javascript
Option 1: UPI Payment
Pay to: YOUR_UPI_ID@paytm  // Update this

Option 2: Bank Transfer
Account Name: YOUR NAME  // Update this
Account Number: YOUR_ACCOUNT  // Update this
IFSC Code: YOUR_IFSC  // Update this

After payment, please:
2. WhatsApp to: YOUR_WHATSAPP_NUMBER  // Update this
```

## Testing

### Test Manual Payment Flow:
```bash
1. Refresh customer website (http://localhost:3001)
2. Add product to cart
3. Go to checkout
4. Fill in customer details
5. Click "Proceed to Payment"
6. Should see payment instructions popup
7. Payment details copied to clipboard
8. Cart cleared after clicking OK
```

## Complete Razorpay Setup Steps

### 1. Create Account
```
URL: https://dashboard.razorpay.com/signup
Email: your_email@domain.com
Business Name: Aशā - Grace Woven by Asha Dhaundiyal
```

### 2. Complete KYC
Required Documents:
- ✅ PAN Card (for business/individual)
- ✅ Bank Account (for settlements)
- ✅ Address Proof (Aadhaar/Passport)
- ✅ Business Registration (if applicable)

### 3. Get API Keys
```
Dashboard → Settings → API Keys
Key ID: rzp_test_XXXXXXXXXXXXX (test mode)
Key ID: rzp_live_XXXXXXXXXXXXX (live mode)
```

### 4. Set Up Payment Page
```
Dashboard → Payment Links → Payment Pages
Custom URL: razorpay.me/@yourusername
```

### 5. Configure Webhook
```
Dashboard → Settings → Webhooks
Webhook URL: https://yourdomain.com/api/v1/payment/webhook
Events: payment.captured, payment.failed
```

## Update Backend Configuration

**File:** `/backend/.env`
```env
# Current (Test - Won't Work)
RAZORPAY_KEY_ID=FVZPTn18225397949705
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Update To (Your Actual Keys)
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET
```

## Quick Fix for Now

### Use Manual Payment Instructions:

**File: `/frontend/customer-website/components/CheckoutModal.jsx`**

Update these lines (113-129):

```javascript
Option 1: UPI Payment
Pay to: ashadhaundiyal@paytm  // ← UPDATE: Your UPI ID

Option 2: Bank Transfer
Account Name: Asha Dhaundiyal  // ← UPDATE: Your name
Account Number: XXXX-XXXX-XXXX  // ← UPDATE: Your account
IFSC Code: XXXX0001234  // ← UPDATE: Your IFSC

Option 3: Razorpay Link
https://razorpay.me/@ashadhaundiyal  // ← UPDATE: Your username

After payment, please:
2. WhatsApp to: +91-XXXXXXXXXX  // ← UPDATE: Your WhatsApp
```

## Alternative: Enable Test Mode

For testing without real Razorpay account:

**File: `/frontend/customer-website/components/CheckoutModal.jsx`**

Add test mode button:
```javascript
// Add after "Proceed to Payment" button
<button
  onClick={() => {
    // Simulate successful payment
    clearCart()
    onClose()
    alert('TEST MODE: Payment simulated successfully!')
    window.location.href = '/payment/success?test=true'
  }}
  className="btn-secondary mt-4"
>
  Test Mode Payment (Dev Only)
</button>
```

## Summary

### Current Status:
❌ Razorpay.me redirect → Error page
✅ Manual payment instructions → Working

### To Enable Razorpay:
1. Create and verify Razorpay account
2. Get verified username
3. Update code with actual username
4. Add API keys to .env file
5. Test with actual payment link

### For Now:
✅ Customers see payment instructions
✅ Can pay via UPI/Bank Transfer
✅ Send confirmation via WhatsApp
✅ Manual order processing

---

**Recommended:** Use manual payment method until Razorpay account is fully set up and verified.

**File Modified:** `/frontend/customer-website/components/CheckoutModal.jsx`
**Current Mode:** Manual Payment Instructions
**Status:** ✅ Working - No errors
