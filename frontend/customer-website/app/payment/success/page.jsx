'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState(null)

  useEffect(() => {
    // Get order details from URL params or localStorage
    const orderId = searchParams.get('order_id')
    const paymentId = searchParams.get('payment_id')
    
    if (orderId && paymentId) {
      setOrderDetails({
        orderId,
        paymentId,
        timestamp: new Date().toLocaleString()
      })
    }
  }, [searchParams])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-beige-50 to-cream py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-serif text-primary-brown mb-4">
              Payment Successful! 🎉
            </h1>
            
            <p className="text-gray-600 mb-8 text-lg">
              Thank you for your purchase! Your order has been confirmed and we'll start processing it right away.
            </p>

            {/* Order Details */}
            {orderDetails && (
              <div className="bg-beige-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-primary-brown mb-4">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">#{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium">{orderDetails.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-medium">{orderDetails.timestamp}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-amber-800 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You'll receive an order confirmation email shortly
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  We'll carefully prepare your handwoven items
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Shipping details will be sent once your order is dispatched
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Expected delivery: 5-7 business days
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/collections"
                className="bg-primary-brown text-white px-8 py-3 rounded-lg font-medium hover:bg-dark-brown transition-colors"
              >
                Continue Shopping
              </Link>
              
              <button
                onClick={() => router.push('/')}
                className="bg-beige-200 text-primary-brown px-8 py-3 rounded-lg font-medium hover:bg-beige-300 transition-colors"
              >
                Return Home
              </button>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-beige-200">
              <p className="text-sm text-gray-600">
                Questions about your order? 
                <br />
                Contact us at{' '}
                <Link href="mailto:orders@ashastore.com" className="text-primary-brown hover:underline">
                  orders@ashastore.com
                </Link>
                {' '}or call{' '}
                <Link href="tel:+91-9876543210" className="text-primary-brown hover:underline">
                  +91-9876543210
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
