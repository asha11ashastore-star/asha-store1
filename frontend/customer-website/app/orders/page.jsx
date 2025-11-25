'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/api'

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [guestOrders, setGuestOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // If not logged in, redirect to login
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }
    
    // If logged in, fetch their orders from database
    if (user) {
      fetchOrders()
    }
  }, [user, authLoading, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // Try to fetch orders from API
      // For now, showing empty state since endpoint might not exist
      const response = await apiService.request('/api/v1/guest-orders')
      
      // Filter orders by user email
      const userOrders = response.filter(order => 
        order.customer_email === user.email
      )
      
      setOrders(userOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige-600 mx-auto mb-4"></div>
            <p className="text-beige-600">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Allow page to render for both logged-in and guest users
  // Guest users will see their recent orders from localStorage

  return (
    <div className="min-h-screen bg-warm-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-primary-brown mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          /* No orders */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-beige-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-beige-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            
            <button
              onClick={() => router.push('/collections')}
              className="bg-primary-brown text-white px-8 py-3 rounded-lg hover:bg-dark-brown transition-colors"
            >
              Browse Collections
            </button>
          </div>
        ) : (
          /* Orders list */
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-brown-50 to-beige-50 p-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-primary-brown mb-1">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                    <div className="flex gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.order_status)}`}>
                        📦 {order.order_status?.toUpperCase() || 'PENDING'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${order.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        💳 {order.payment_status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Status Timeline */}
                <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className={`flex items-center gap-2 ${order.order_status === 'pending' || order.order_status === 'processing' || order.order_status === 'shipped' || order.order_status === 'delivered' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${order.order_status === 'pending' || order.order_status === 'processing' || order.order_status === 'shipped' || order.order_status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                        ✓
                      </span>
                      <span>Ordered</span>
                    </div>
                    <div className={`flex-1 h-0.5 mx-2 ${order.order_status === 'processing' || order.order_status === 'shipped' || order.order_status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center gap-2 ${order.order_status === 'processing' || order.order_status === 'shipped' || order.order_status === 'delivered' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${order.order_status === 'processing' || order.order_status === 'shipped' || order.order_status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                        {order.order_status === 'processing' || order.order_status === 'shipped' || order.order_status === 'delivered' ? '✓' : ''}
                      </span>
                      <span>Processing</span>
                    </div>
                    <div className={`flex-1 h-0.5 mx-2 ${order.order_status === 'shipped' || order.order_status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center gap-2 ${order.order_status === 'shipped' || order.order_status === 'delivered' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${order.order_status === 'shipped' || order.order_status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                        {order.order_status === 'shipped' || order.order_status === 'delivered' ? '✓' : ''}
                      </span>
                      <span>Shipped</span>
                    </div>
                    <div className={`flex-1 h-0.5 mx-2 ${order.order_status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center gap-2 ${order.order_status === 'delivered' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${order.order_status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                        {order.order_status === 'delivered' ? '✓' : ''}
                      </span>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4">
                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.product_name}</p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × ₹{parseFloat(item.price).toLocaleString()}
                              </p>
                            </div>
                            <p className="font-semibold text-primary-brown">
                              ₹{(item.quantity * parseFloat(item.price)).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No items found</p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-700">{order.customer_name}</p>
                    <p className="text-sm text-gray-600">{order.customer_address}</p>
                    <p className="text-sm text-gray-600">{order.customer_phone}</p>
                    <p className="text-sm text-gray-600">{order.customer_email}</p>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium text-gray-900">{order.payment_method || 'Razorpay'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-primary-brown">
                        ₹{parseFloat(order.total_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {order.order_status === 'shipped' && (
                    <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-purple-800 font-semibold mb-2">📦 Your order has been shipped!</p>
                      <p className="text-xs text-purple-700">Expected delivery in 3-5 business days</p>
                    </div>
                  )}
                  
                  {order.order_status === 'delivered' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-semibold">✅ Your order has been delivered!</p>
                      <p className="text-xs text-green-700 mt-1">Thank you for shopping with us!</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
