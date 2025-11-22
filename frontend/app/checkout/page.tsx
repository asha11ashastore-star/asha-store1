'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { 
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  MapPin,
  Phone,
  User,
  CheckCircle,
  AlertCircle,
  Lock
} from 'lucide-react'

interface CheckoutItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  seller: string
}

interface Address {
  id: number
  name: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState<number>(1)
  const [selectedPayment, setSelectedPayment] = useState<string>('card')
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock data
  const cartItems: CheckoutItem[] = [
    {
      id: 1,
      name: 'Bridal Lehenga Collection',
      price: 45999,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1756483510809-122c56fbb035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjBkZXNpZ25lcnxlbnwxfHx8fDE3NjI3NTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      seller: 'Royal Fashion House'
    },
    {
      id: 2,
      name: 'North Indian Thali',
      price: 299,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjByZXN0YXVyYW50fGVufDF8fHx8MTc2Mjc1ODY4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      seller: 'Spice Garden Restaurant'
    }
  ]

  const addresses: Address[] = [
    {
      id: 1,
      name: 'John Doe',
      phone: '+91 98765 43210',
      addressLine1: '123 Main Street',
      addressLine2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true
    },
    {
      id: 2,
      name: 'John Doe',
      phone: '+91 98765 43210',
      addressLine1: '456 Park Avenue',
      addressLine2: 'Floor 2',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      isDefault: false
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = subtotal > 499 ? 0 : 49
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const total = subtotal + deliveryFee + tax

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setCurrentStep(4) // Success step
  }

  const steps = [
    { id: 1, title: 'Address', completed: currentStep > 1 },
    { id: 2, title: 'Payment', completed: currentStep > 2 },
    { id: 3, title: 'Review', completed: currentStep > 3 },
    { id: 4, title: 'Complete', completed: currentStep >= 4 }
  ]

  // Success Page
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600 mb-6">
                Your order has been confirmed and will be delivered soon.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-mono font-bold">#ORD-2024-001</p>
              </div>
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Track Your Order
                </Button>
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${step.completed 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                  }
                `}>
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.completed || currentStep === step.id ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedAddress === address.id 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{address.name}</h3>
                            {address.isDefault && (
                              <Badge className="bg-green-100 text-green-800 text-xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-gray-700">{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p className="text-gray-700">{address.addressLine2}</p>
                          )}
                          <p className="text-gray-700">{address.city}, {address.state} - {address.pincode}</p>
                          <p className="text-gray-600 text-sm mt-1">Phone: {address.phone}</p>
                        </div>
                        <div className={`
                          w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${selectedAddress === address.id ? 'border-blue-600' : 'border-gray-300'}
                        `}>
                          {selectedAddress === address.id && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>

                  <Button 
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Options */}
                  <div className="space-y-4">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedPayment === 'card' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPayment('card')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5" />
                          <span className="font-medium">Credit/Debit Card</span>
                        </div>
                        <div className={`
                          w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${selectedPayment === 'card' ? 'border-blue-600' : 'border-gray-300'}
                        `}>
                          {selectedPayment === 'card' && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedPayment === 'upi' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPayment('upi')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5" />
                          <span className="font-medium">UPI Payment</span>
                        </div>
                        <div className={`
                          w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${selectedPayment === 'upi' ? 'border-blue-600' : 'border-gray-300'}
                        `}>
                          {selectedPayment === 'upi' && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedPayment === 'cod' 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPayment('cod')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5" />
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <div className={`
                          w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${selectedPayment === 'cod' ? 'border-blue-600' : 'border-gray-300'}
                        `}>
                          {selectedPayment === 'cod' && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Details Form */}
                  {selectedPayment === 'card' && (
                    <div className="border-t pt-6 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">by {item.seller}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {addresses.find(addr => addr.id === selectedAddress) && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-1">
                          {addresses.find(addr => addr.id === selectedAddress)?.name}
                        </h3>
                        <p className="text-gray-700">
                          {addresses.find(addr => addr.id === selectedAddress)?.addressLine1}
                        </p>
                        <p className="text-gray-700">
                          {addresses.find(addr => addr.id === selectedAddress)?.city}, {addresses.find(addr => addr.id === selectedAddress)?.state} - {addresses.find(addr => addr.id === selectedAddress)?.pincode}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">
                        {selectedPayment === 'card' && 'Credit/Debit Card'}
                        {selectedPayment === 'upi' && 'UPI Payment'}
                        {selectedPayment === 'cod' && 'Cash on Delivery'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Place Order
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                {/* Benefits */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Secure & encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Free delivery on orders above ₹499</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4 text-purple-600" />
                    <span>Easy returns within 7 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
