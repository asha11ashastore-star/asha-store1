'use client'
// @ts-nocheck
import { useState } from 'react'
import { Mail, Gift, Bell, Truck, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubscribed(true)
    setIsLoading(false)
    setEmail('')
  }

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle className="h-16 w-16 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome to ShopAll Family! 🎉
          </h2>
          <p className="text-blue-100 text-lg mb-6">
            Thank you for subscribing! Check your email for your welcome gift.
          </p>
          <Button 
            onClick={() => setIsSubscribed(false)}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Subscribe Another Email
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stay in the Loop!
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and special offers.
          </p>
        </div>

        {/* Newsletter Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </div>
              ) : (
                'Subscribe Now'
              )}
            </Button>
          </form>
          
          <p className="text-gray-500 text-sm text-center mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="text-center">
            <div className="bg-white/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Exclusive Deals</h3>
            <p className="text-blue-100">
              Get access to subscriber-only discounts and early bird offers
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">New Arrivals</h3>
            <p className="text-blue-100">
              Be the first to discover the latest products and trending items
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
            <p className="text-blue-100">
              Enjoy free shipping on orders above ₹500 as a newsletter subscriber
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-12">
          <p className="text-blue-100 mb-4">
            Join <span className="font-bold text-white">2M+ subscribers</span> who never miss a deal!
          </p>
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-8 h-8 bg-white/20 rounded-full"></div>
            ))}
            <span className="text-white font-medium ml-2">+2M more</span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-blue-100 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              No spam, ever
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Unsubscribe anytime
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              100% secure
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Weekly updates only
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
