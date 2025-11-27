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
  const [authCheckComplete, setAuthCheckComplete] = useState(false)
  const [waitingForRestore, setWaitingForRestore] = useState(false)

  useEffect(() => {
    console.log('🔄 Orders page - Auth status:', {
      authLoading,
      userExists: !!user,
      userEmail: user?.email,
      tokenExists: !!localStorage.getItem('auth_token'),
      userDataExists: !!localStorage.getItem('user_data')
    })
    
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('⏳ Waiting for auth to load...')
      return
    }
    
    // If user is logged in, fetch orders
    if (user) {
      console.log('✅ User logged in, fetching orders for:', user.email)
      setAuthCheckComplete(true)
      fetchOrders()
      return
    }
    
    // No user - check if we should wait or redirect
    console.warn('⚠️ No user found on orders page')
    
    // Check if we have auth data that might restore soon
    const hasToken = !!localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (!hasToken && !userData) {
      // Definitely not logged in - redirect immediately
      console.log('❌ No token or user data, redirecting to login')
      router.push('/auth/login')
      return
    }
    
    // We have token/data, so wait longer for context to restore (especially after payment redirect)
    if (!authCheckComplete && !waitingForRestore) {
      console.log('🔄 Token/userData exists, waiting 3 seconds for auth context to restore...')
      setWaitingForRestore(true)
      
      const restoreTimer = setTimeout(() => {
        setAuthCheckComplete(true)
        // Check one more time after waiting
        if (!user) {
          console.log('❌ Auth did not restore after 3 seconds, redirecting to login')
          router.push('/auth/login')
        }
      }, 3000) // Wait 3 seconds for auth to restore after payment redirect
      
      return () => clearTimeout(restoreTimer)
    }
    
  }, [user, authLoading, router, authCheckComplete, waitingForRestore])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📋 Fetching orders for customer:', user?.email)
      
      // Use customer-specific endpoint - no seller auth required!
      const customerEmail = encodeURIComponent(user.email)
      const response = await apiService.request(`/api/v1/guest-orders/my-orders/${customerEmail}`)
      
      console.log('📋 Customer orders found:', response?.length || 0)
      
      // Response is already filtered for this customer
      const userOrders = response || []
      
      userOrders.forEach(order => {
        console.log('✅ Found order:', order.order_number, 'Status:', order.order_status, 'Payment:', order.payment_status)
      })
      
      setOrders(userOrders)
      
      if (userOrders.length === 0) {
        console.warn('⚠️ No orders found for customer:', user.email)
        console.warn('⚠️ This could mean:')
        console.warn('   - You haven\'t placed any orders yet')
        console.warn('   - Order just placed (wait 5-10 seconds and refresh)')
        console.warn('   - Different email used for order')
      } else {
        console.log('✅ Successfully loaded', userOrders.length, 'order(s)')
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error)
      setError('Failed to load orders. Please refresh the page.')
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

  if (authLoading || loading || waitingForRestore) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige-600 mx-auto mb-4"></div>
            <p className="text-beige-600">
              {waitingForRestore ? 'Restoring your session after payment...' : 'Loading your orders...'}
            </p>
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif text-primary-brown mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
            {user && (
              <p className="text-sm text-gray-500 mt-1">Logged in as: {user.email}</p>
            )}
          </div>
          <button
            onClick={() => fetchOrders()}
            className="px-4 py-2 bg-primary-brown text-white rounded-lg hover:bg-dark-brown transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
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
