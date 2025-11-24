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
    // Load guest orders from localStorage
    try {
      const savedGuestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]')
      setGuestOrders(savedGuestOrders)
      console.log('Loaded guest orders:', savedGuestOrders)
    } catch (e) {
      console.warn('Could not load guest orders:', e)
    }
    
    // If not logged in, don't redirect - show guest orders instead
    if (!authLoading && !user) {
      setLoading(false)
    }
  }, [user, authLoading])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

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
        {!user && guestOrders.length > 0 ? (
          /* Guest Orders Display */
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>📦 Your Recent Orders</strong> (Guest Checkout)
                <br />
                <span className="text-xs">These are orders you placed without logging in. They're stored on this device only.</span>
              </p>
            </div>
            
            {guestOrders.map((guestOrder, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{guestOrder.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(guestOrder.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Paid
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Payment ID:</strong> {guestOrder.paymentId}
                  </p>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
                    <p className="text-xs text-amber-800">
                      💡 <strong>To track this order or get support:</strong>
                      <br />
                      Contact us with your order number and email address
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <a
                      href={`mailto:orders@ashastore.com?subject=Order ${guestOrder.orderNumber}`}
                      className="flex-1 text-center bg-primary-brown text-white px-4 py-2 rounded-lg hover:bg-dark-brown transition-colors text-sm"
                    >
                      📧 Email Us
                    </a>
                    <a
                      href="tel:+919876543210"
                      className="flex-1 text-center bg-beige-200 text-primary-brown px-4 py-2 rounded-lg hover:bg-beige-300 transition-colors text-sm"
                    >
                      📞 Call Us
                    </a>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => router.push('/collections')}
              className="w-full bg-beige-100 text-primary-brown px-8 py-3 rounded-lg hover:bg-beige-200 transition-colors mt-4"
            >
              Continue Shopping
            </button>
          </div>
        ) : orders.length === 0 && user ? (
          /* Logged-in user with no orders */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-beige-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-beige-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders with this account yet.</p>
            
            <button
              onClick={() => router.push('/collections')}
              className="bg-primary-brown text-white px-8 py-3 rounded-lg hover:bg-dark-brown transition-colors"
            >
              Browse Collections
            </button>
          </div>
        ) : !user && guestOrders.length === 0 ? (
          /* Guest user with no orders */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-beige-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-beige-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            
            {/* Guest Order Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <p className="text-sm text-amber-800">
                <strong>💡 Previous orders will appear here automatically</strong>
                <br />
                When you complete a payment, your order will be saved and shown on this page.
              </p>
            </div>
            
            <button
              onClick={() => router.push('/collections')}
              className="bg-primary-brown text-white px-8 py-3 rounded-lg hover:bg-dark-brown transition-colors"
            >
              Browse Collections
            </button>
          </div>
        ) : user && orders.length > 0 ? (
          /* Logged-in user with orders */
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
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
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4 mb-4">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 py-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ₹{parseFloat(item.price).toLocaleString()}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{(item.quantity * parseFloat(item.price)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="border-t pt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>Payment: {order.payment_method}</p>
                    {order.customer_address && (
                      <p className="mt-1">Deliver to: {order.customer_address}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-primary-brown">
                      ₹{parseFloat(order.total_amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  )
}
