'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight,
  Heart,
  Tag,
  Truck,
  Shield
} from 'lucide-react'

interface CartItem {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  seller: string
  quantity: number
  inStock: boolean
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Bridal Lehenga Collection',
      price: 45999,
      originalPrice: 59999,
      image: 'https://images.unsplash.com/photo-1756483510809-122c56fbb035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjBkZXNpZ25lcnxlbnwxfHx8fDE3NjI3NTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Clothing',
      seller: 'Royal Fashion House',
      quantity: 1,
      inStock: true
    },
    {
      id: 2,
      name: 'North Indian Thali',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjByZXN0YXVyYW50fGVufDF8fHx8MTc2Mjc1ODY4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Food',
      seller: 'Spice Garden Restaurant',
      quantity: 2,
      inStock: true
    }
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const moveToWishlist = (id: number) => {
    // Add to wishlist logic here
    removeItem(id)
    alert('Item moved to wishlist!')
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalSavings = cartItems.reduce((sum, item) => 
    sum + ((item.originalPrice - item.price) * item.quantity), 0
  )
  const deliveryFee = subtotal > 499 ? 0 : 49
  const total = subtotal + deliveryFee

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          {/* Empty Cart */}
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Link href="/marketplace">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Shopping
                </Button>
              </Link>
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
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <Badge className="bg-blue-600 text-white px-3 py-1">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="w-full sm:w-48 h-48 sm:h-32">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-gray-100 text-gray-800 text-xs">
                              {item.category}
                            </Badge>
                            {!item.inStock && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">by {item.seller}</p>
                          
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-xl font-bold text-gray-900">
                              ₹{item.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>

                          {/* Quantity & Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-50 rounded-l-lg"
                                  disabled={!item.inStock}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 border-x border-gray-300 bg-gray-50 min-w-16 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-50 rounded-r-lg"
                                  disabled={!item.inStock}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => moveToWishlist(item.id)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Heart className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="mt-4 sm:mt-0 sm:ml-6 text-right">
                          <div className="text-xl font-bold text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-gray-600">
                              ₹{item.price.toLocaleString()} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You're saving</span>
                    <span className="font-medium">-₹{totalSavings.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                {deliveryFee > 0 && (
                  <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                    <Tag className="h-3 w-3 inline mr-1" />
                    Add ₹{(500 - subtotal).toLocaleString()} more for free delivery
                  </div>
                )}

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3" size="lg">
                  <Link href="/checkout" className="flex items-center justify-center w-full">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <div className="text-center">
                  <Link href="/marketplace" className="text-blue-600 hover:text-blue-500 text-sm">
                    Continue Shopping
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span>Free delivery on orders above ₹499</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Secure & encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <ArrowLeft className="h-4 w-4 text-purple-600" />
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
