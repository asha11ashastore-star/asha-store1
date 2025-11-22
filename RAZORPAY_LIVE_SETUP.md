# 💳 Razorpay Live Payment Setup - Complete Guide

## 🎯 Make Your Aशा Store Accept Real Payments!

This guide will help you set up **real Razorpay payments** for your store.

---

## 📋 Prerequisites

Before starting, you need:
- ✅ A business/personal PAN card
- ✅ Bank account details
- ✅ GST number (optional, but recommended for business)
- ✅ Business address proof

---

## 🚀 Step-by-Step Setup

### **Step 1: Create Razorpay Account**

1. **Go to Razorpay:**
   ```
   https://razorpay.com/
   ```

2. **Click "Sign Up"**
   - Choose: **Individual** or **Business**
   - For Aशā Store: Choose **Business**

3. **Fill Registration:**
   ```
   Business Name: Aशā - Grace Woven by Asha Dhaundiyal
   Email: your-email@gmail.com
   Phone: +91 98181 74388
   ```

4. **Verify Email & Phone:**
   - Check email for verification link
   - Enter OTP sent to phone

---

### **Step 2: Complete KYC (Know Your Customer)**

Razorpay requires verification before accepting payments:

1. **Login to Razorpay Dashboard:**
   ```
   https://dashboard.razorpay.com/
   ```

2. **Go to Settings → Account & Settings**

3. **Submit KYC Documents:**
   ```
   Personal Details:
   - Full Name: Asha Dhaundiyal
   - PAN Card: Upload PAN card photo
   - Date of Birth
   
   Business Details:
   - Business Name: Aशā
   - Business Type: Sole Proprietorship / Individual
   - Business Address
   
   Bank Details:
   - Account Number
   - IFSC Code
   - Bank Name
   - Account Holder Name
   ```

4. **Verification Time:**
   - Usually 24-48 hours
   - You'll receive email confirmation

---

### **Step 3: Activate Your Account**

1. **After KYC Approval:**
   - Go to Dashboard
   - You'll see "Account Activated" ✅

2. **Set Up Settlement:**
   ```
   Razorpay will transfer money to your bank:
   - T+3 days (3 days after payment)
   - Or instant settlement (with fee)
   ```

---

### **Step 4: Get Your API Keys**

1. **Go to Settings → API Keys:**
   ```
   https://dashboard.razorpay.com/app/keys
   ```

2. **You'll see TWO modes:**
   
   **Test Mode (for testing):**
   ```
   Key ID: rzp_test_xxxxxxxxxxxxx
   Key Secret: xxxxxxxxxxxxxxxxx
   ```
   
   **Live Mode (for real money):**
   ```
   Key ID: rzp_live_xxxxxxxxxxxxx
   Key Secret: xxxxxxxxxxxxxxxxx
   ```

3. **Copy Your LIVE Key ID** (starts with `rzp_live_`)

---

### **Step 5: Set Up Payment Page**

#### **Option A: Razorpay Payment Page (Simplest)**

1. **Go to Payment Pages:**
   ```
   https://dashboard.razorpay.com/app/payment-pages
   ```

2. **Create New Payment Page:**
   ```
   Page Name: Aशā Store Checkout
   Description: Payment for handwoven sarees
   ```

3. **Settings:**
   ```
   ✅ Accept partial payments: OFF
   ✅ Allow customer to edit amount: OFF (IMPORTANT!)
   ✅ Send confirmation email: ON
   ✅ Send SMS: ON
   ```

4. **Your Payment Link:**
   ```
   https://rzp.io/l/xxxxxxxx
   OR
   https://razorpay.me/@yourname
   ```

5. **Copy this link!**

---

#### **Option B: Razorpay.me Personal Link (Even Simpler!)**

1. **Go to:**
   ```
   https://razorpay.me/
   ```

2. **Create Your Link:**
   ```
   Choose username: @ashadhaundiyal
   Your link: https://razorpay.me/@ashadhaundiyal
   ```

3. **This is what you're already using!** ✅

---

### **Step 6: Update Your Website**

Now connect your website to Razorpay:

#### **Update Environment Variables:**

Open: `/frontend/customer-website/.env.local`

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Razorpay LIVE Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx

# Your Razorpay Payment Link
NEXT_PUBLIC_RAZORPAY_PAYMENT_LINK=https://razorpay.me/@ashadhaundiyal
```

**IMPORTANT:** Replace with YOUR actual live key!

---

### **Step 7: Update CheckoutModal**

The payment link is already in your code:
```javascript
const RAZORPAY_PAYMENT_LINK = 'https://razorpay.me/@ashadhaundiyal'
```

**Make sure it matches your actual Razorpay.me link!**

---

### **Step 8: Test Your Setup**

#### **Test Mode First:**

1. **Switch to Test Mode** in Razorpay Dashboard
2. **Use Test Card:**
   ```
   Card Number: 4111 1111 1111 1111
   CVV: Any 3 digits
   Expiry: Any future date
   ```
3. **Make a test purchase**
4. **Check if order appears in dashboard**

#### **Go Live:**

1. **Switch to Live Mode** in Razorpay Dashboard
2. **Update `.env.local` with live keys**
3. **Make a small real purchase (₹1)**
4. **Verify money reaches your bank** (T+3 days)

---

## 💰 How Payments Work

### **Customer Flow:**

```
1. Customer adds items to cart
2. Clicks "Proceed to Payment"
3. Fills delivery address
4. Clicks "Pay Now"
   ↓
5. Redirected to Razorpay payment page
6. Sees locked amount (cannot edit!)
7. Enters card/UPI/netbanking details
8. Completes payment
   ↓
9. Order saved in your database
10. You get notification
11. Money goes to your bank (T+3 days)
```

---

## 🔒 Security Features

Your setup includes:

✅ **Amount is locked** - Customer cannot change price
✅ **Order saved first** - Database has order details
✅ **Secure Razorpay** - PCI DSS compliant
✅ **No card details stored** - Razorpay handles it
✅ **Customer gets receipt** - Email confirmation

---

## 📊 Monitoring Payments

### **Razorpay Dashboard:**

1. **View All Payments:**
   ```
   Dashboard → Transactions → Payments
   ```

2. **Check Settlements:**
   ```
   Dashboard → Settlements
   ```

3. **Download Reports:**
   ```
   Dashboard → Reports → Export
   ```

---

## 💡 Payment Methods Supported

Razorpay accepts:

- ✅ **Credit Cards** (Visa, MasterCard, RuPay, Amex)
- ✅ **Debit Cards** (All Indian banks)
- ✅ **UPI** (Google Pay, PhonePe, Paytm, BHIM)
- ✅ **Net Banking** (All major banks)
- ✅ **Wallets** (Paytm, Mobikwik, etc.)
- ✅ **EMI** (Credit card EMI)
- ✅ **Cardless EMI** (ZestMoney, etc.)

---

## 💸 Pricing & Fees

### **Razorpay Charges:**

```
Standard Plan:
- 2% per transaction
- No setup fee
- No annual fee
- No hidden charges

Example:
₹5,000 sale = ₹100 fee
You receive: ₹4,900
```

### **Settlement:**

```
T+3 days: Free
Instant: 0.25% extra fee
```

---

## 🎯 Your Current Setup

**Payment Link:**
```
https://razorpay.me/@ashadhaundiyal
```

**What Happens:**
1. Order total: ₹5,000
2. Customer clicks "Pay Now"
3. Opens: `https://razorpay.me/@ashadhaundiyal?amount=500000`
4. Amount is pre-filled (₹5,000)
5. Customer pays
6. Money comes to you!

---

## ✅ Checklist for Going Live

- [ ] Created Razorpay account
- [ ] Completed KYC verification
- [ ] Account activated
- [ ] Got Live API keys
- [ ] Created payment page/link
- [ ] Updated `.env.local` with live keys
- [ ] Tested with small amount
- [ ] Verified settlement in bank
- [ ] Ready to accept real payments! 🎉

---

## 🚨 Important Security Notes

### **NEVER share:**
- ❌ API Key Secret
- ❌ Webhook Secret
- ❌ Account login details

### **DO share:**
- ✅ Payment link (razorpay.me/@yourname)
- ✅ Public Key ID (starts with rzp_live_)

---

## 📞 Support

### **Razorpay Support:**
```
Email: support@razorpay.com
Phone: 1800-120-020-080 (Toll-free)
Hours: 24/7
```

### **Dashboard:**
```
https://dashboard.razorpay.com/support
```

---

## 🎉 You're Ready!

Once you complete these steps:

1. **Customers can pay with any method**
2. **You get money in your bank**
3. **Automatic order tracking**
4. **Professional payment experience**

**Your Aशā Store is ready to accept real payments!** 💳✨

---

## 📱 Quick Reference

**Your Links:**
- Dashboard: https://dashboard.razorpay.com/
- Payment Link: https://razorpay.me/@ashadhaundiyal
- Support: https://razorpay.com/support/

**Test Cards:**
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002

**Remember:**
- Test mode: rzp_test_xxx
- Live mode: rzp_live_xxx
- Always test before going live!

---

**Good luck with your live payments!** 🚀
