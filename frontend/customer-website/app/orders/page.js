'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/api'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      const response = await apiService.getOrders()
      setOrders(response)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-warm-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-primary-brown mb-4">My Orders</h1>
            <p className="text-gray-600 mb-8">Please log in to view your orders.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-rich-brown text-white px-6 py-3 rounded-lg hover:bg-primary-brown transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-primary-brown mb-8">My Orders</h1>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-warm-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-primary-brown mb-8">My Orders</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchOrders}
              className="bg-rich-brown text-white px-6 py-3 rounded-lg hover:bg-primary-brown transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-primary-brown">My Orders</h1>
          <p className="text-gray-600">Welcome back, {user?.name || user?.email}</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-xl font-serif text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here.</p>
              <button 
                onClick={() => window.location.href = '/collections'}
                className="bg-rich-brown text-white px-6 py-3 rounded-lg hover:bg-primary-brown transition-colors"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">₹{order.total_amount}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Items ({order.items?.length || 0})</h4>
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.product?.name}</h5>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Shipping Address</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.shipping_address?.name}<br />
                        {order.shipping_address?.address_line_1}<br />
                        {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
                      </p>
                    </div>
                    <button 
                      onClick={() => window.location.href = `/orders/${order.id}`}
                      className="text-rich-brown hover:text-primary-brown font-medium text-sm"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
