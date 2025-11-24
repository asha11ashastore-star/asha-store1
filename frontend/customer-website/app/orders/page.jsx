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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

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

  if (!user) {
    return null
  }

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
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-beige-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-beige-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-4">You haven't placed any orders with this account yet.</p>
            
            {/* Guest Order Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <p className="text-sm text-amber-800">
                <strong>💡 Did you checkout as a guest?</strong>
                <br />
                Guest orders are not shown here. To track your order, please contact us with:
              </p>
              <ul className="mt-2 text-sm text-amber-700 space-y-1 ml-4">
                <li>• Your order number (ORD-XXXXXXXX)</li>
                <li>• Your email address</li>
              </ul>
              <p className="mt-2 text-xs text-amber-600">
                📧 Email: orders@ashastore.com<br />
                📞 Phone: +91-9876543210
              </p>
            </div>
            
            <button
              onClick={() => router.push('/collections')}
              className="bg-primary-brown text-white px-8 py-3 rounded-lg hover:bg-dark-brown transition-colors"
            >
              Browse Collections
            </button>
          </div>
        ) : (
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
        )}
      </div>

      <Footer />
    </div>
  )
}
