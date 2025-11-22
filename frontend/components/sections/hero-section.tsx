'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { 
  Search, 
  ShoppingBag, 
  Star, 
  Truck, 
  Shield, 
  Users,
  TrendingUp,
  Zap
} from 'lucide-react'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-slate-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-48 h-48 bg-purple-600 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px] py-16">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-blue-600 text-white px-4 py-2 text-sm">
                🎉 New Launch: Complete Marketplace
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Your One-Stop
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {" "}Multi-Vendor{" "}
                </span>
                Marketplace
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover amazing products from trusted sellers. Shop clothing, food, and daily essentials with secure payments and lightning-fast delivery.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 p-2">
                <Search className="h-5 w-5 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search for clothing, food, groceries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-transparent border-0 focus:outline-none"
                />
                <Button className="rounded-full bg-blue-600 hover:bg-blue-700 px-8">
                  Search
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/marketplace">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Explore Marketplace
                </Button>
              </Link>
              
              <Link href="/auth/register">
                <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-600 px-8 py-4 rounded-xl">
                  <Users className="h-5 w-5 mr-2" />
                  Join as Seller
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">10,000+ Happy Customers</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.8/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 transform rotate-3">
              {/* Featured Product Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl mb-3 flex items-center justify-center">
                    <span className="text-4xl">👗</span>
                  </div>
                  <h3 className="font-semibold text-sm">Designer Clothes</h3>
                  <p className="text-xs text-gray-600">From ₹999</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-xl mb-3 flex items-center justify-center">
                    <span className="text-4xl">🍎</span>
                  </div>
                  <h3 className="font-semibold text-sm">Fresh Groceries</h3>
                  <p className="text-xs text-gray-600">From ₹99</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-8">
                <div className="bg-white rounded-2xl shadow-lg p-4 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-square bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl mb-3 flex items-center justify-center">
                    <span className="text-4xl">🍕</span>
                  </div>
                  <h3 className="font-semibold text-sm">Delicious Food</h3>
                  <p className="text-xs text-gray-600">From ₹199</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mb-3 flex items-center justify-center">
                    <span className="text-4xl">🏠</span>
                  </div>
                  <h3 className="font-semibold text-sm">Home Essentials</h3>
                  <p className="text-xs text-gray-600">From ₹149</p>
                </div>
              </div>
            </div>
            
            {/* floating badges */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-semibold animate-bounce">
              <Truck className="h-3 w-3 inline mr-1" />
              Free Delivery
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white rounded-full px-3 py-1 text-xs font-semibold animate-pulse">
              <Shield className="h-3 w-3 inline mr-1" />
              100% Secure
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="border-t border-gray-200 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50,000+</div>
              <div className="text-sm text-gray-600">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1,000+</div>
              <div className="text-sm text-gray-600">Active Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">99.8%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
