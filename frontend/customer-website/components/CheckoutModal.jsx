'use client'
import { useState } from 'react'
import { useCart } from './CartProvider'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://asha-store-backend.onrender.com'

export default function CheckoutModal({ isOpen, onClose, onSuccess }) {
  const { items, getTotal, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: ''
  })
  const [errors, setErrors] = useState({})
  
  // Your Razorpay Payment Page Link
  const RAZORPAY_PAYMENT_LINK = 'https://razorpay.me/@ashadhaundiyal'

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors = {}
    
    if (!customerInfo.name.trim()) newErrors.name = 'Name is required'
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required'
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone is required'
    if (!customerInfo.address.trim()) newErrors.address = 'Street address is required'
    if (!customerInfo.city.trim()) newErrors.city = 'City is required'
    if (!customerInfo.state.trim()) newErrors.state = 'State is required'
    if (!customerInfo.pinCode.trim()) newErrors.pinCode = 'PIN code is required'
    
    // PIN code validation
    const pinRegex = /^[1-9][0-9]{5}$/
    if (customerInfo.pinCode && !pinRegex.test(customerInfo.pinCode)) {
      newErrors.pinCode = 'Please enter a valid 6-digit PIN code'
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (customerInfo.email && !emailRegex.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    // Phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/
    if (customerInfo.phone && !phoneRegex.test(customerInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckout = async () => {
    // Validate form first
    if (!validateForm()) {
      alert('Please fill in all required fields correctly.')
      return
    }

    setIsLoading(true)

    try {
      const totalAmount = parseFloat(getTotal())
      
      // Verify amount
      if (!totalAmount || totalAmount <= 0) {
        throw new Error('Invalid order amount. Please check your cart.')
      }
      
      console.log('Creating order with amount:', totalAmount)
      
      // Create order in database with formatted address
      const fullAddress = `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pinCode}`
      
      const orderData = {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: fullAddress,
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: parseFloat(item.price.toString().replace(/[^0-9.]/g, ''))
        })),
        total_amount: totalAmount,
        payment_method: 'razorpay',
        notes: 'Payment via Razorpay.me'
      }

      console.log('Sending order data:', orderData)

      // Save order to backend
      const orderResponse = await fetch(`${API_BASE_URL}/api/v1/guest-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        console.error('Order creation failed:', errorData)
        throw new Error(errorData.detail || 'Failed to create order')
      }

      const savedOrder = await orderResponse.json()
      console.log('Order created successfully:', savedOrder)
      
      // Create payment URL with amount (in paise: ₹1 = 100 paise)
      const amountInPaise = Math.round(totalAmount * 100)
      const paymentUrl = `${RAZORPAY_PAYMENT_LINK}?amount=${amountInPaise}`
      
      console.log('Opening payment URL:', paymentUrl)
      console.log('Amount:', totalAmount, 'Paise:', amountInPaise)
      
      // Open Razorpay payment page
      const opened = window.open(paymentUrl, '_blank')
      
      if (!opened) {
        alert('Payment page blocked! Please allow popups and try again.')
        setIsLoading(false)
        return
      }
      
      // Show success message
      alert(`✅ ORDER PLACED!\n\nOrder Number: ${savedOrder.order_number}\n\nTotal: ₹${totalAmount}\n\nPayment page opened in new tab.\nComplete your payment to confirm order.\n\nThank you!`)
      
      // Clear cart and close
      clearCart()
      if (onSuccess) onSuccess(savedOrder.order_number)
      onClose()
      setIsLoading(false)

    } catch (error) {
      console.error('Checkout error:', error)
      alert(`Error: ${error.message || 'Failed to process order'}\n\nPlease try again or contact support.`)
      setIsLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-brown-800 to-brown-700 text-white p-4 sm:p-6 rounded-t-lg sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold">Checkout</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-3xl sm:text-2xl p-2 -m-2"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 pb-6 sm:pb-8">
            {/* Order Summary */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Summary</h3>
              <div className="space-y-2 sm:space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start sm:items-center border-b pb-2 sm:pb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{item.name}</p>
                      <div className="flex flex-wrap gap-2 items-center text-xs sm:text-sm text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        {item.selectedSize && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-brown-100 text-brown-800 font-semibold">
                              Size: {item.selectedSize}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold text-sm sm:text-base whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2">
                <p className="text-lg sm:text-xl font-bold">Total</p>
                <p className="text-lg sm:text-xl font-bold text-maroon">{formatPrice(getTotal())}</p>
              </div>
            </div>

            {/* Customer Information Form */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Customer Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10-digit mobile number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  rows="2"
                  className={`w-full px-3 sm:px-4 py-3 sm:py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="House/Flat No., Street, Landmark"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                    className={`w-full px-3 sm:px-4 py-3 sm:py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.state}
                    onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                    className={`w-full px-3 sm:px-4 py-3 sm:py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600 ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customerInfo.pinCode}
                  onChange={(e) => setCustomerInfo({...customerInfo, pinCode: e.target.value})}
                  maxLength="6"
                  className={`w-full px-3 sm:px-4 py-3 sm:py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600 ${
                    errors.pinCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="6-digit PIN code"
                />
                {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
              </div>
            </div>

            {/* Custom Measurement Section */}
            <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-semibold text-green-800 mb-2">
                    📏 Need Custom Size/Measurements?
                  </h4>
                  <p className="text-sm sm:text-base text-green-700 mb-3">
                    For perfectly tailored fit, share your measurements via WhatsApp
                  </p>
                  
                  <a
                    href={`https://wa.me/919818174388?text=${encodeURIComponent(
                      `Hi! I want to order:\n` +
                      items.map(item => `${item.name} (₹${item.price} × ${item.quantity})`).join('\n') +
                      `\n\nI would like to share my measurements for custom fitting.\n` +
                      `My details:\n` +
                      `Name: ${customerInfo.name || '[Please fill]'}\n` +
                      `Phone: ${customerInfo.phone || '[Please fill]'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp Measurements
                  </a>
                  
                  <p className="text-xs sm:text-sm text-green-600 mt-3 font-medium">
                    📞 +91 98181 74388 | Available 24/7
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Share bust, waist, hip, height & other measurements
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Button Section */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-gray-200 sticky bottom-0 bg-white pb-2">
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full text-white py-4 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                style={{ background: 'linear-gradient(to right, #B83C3A, #8B1A1A)', minHeight: '56px' }}
              >
                {isLoading ? 'Creating Order...' : '🔒 Proceed to Payment'}
              </button>
              <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 sm:mt-3">
                🔒 Secure payment via Razorpay.me
              </p>
              <p className="text-xs text-gray-400 text-center mt-1">
                You'll be redirected to Razorpay payment page
              </p>
            </div>
          </div>
        </div>
    </div>
  )
}
