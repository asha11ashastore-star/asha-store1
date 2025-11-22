'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import apiService from '../../../services/api'
import Link from 'next/link'

export default function OrderDetailPage({ params }) {
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchOrderDetails()
    } else if (!isAuthenticated) {
      setIsLoading(false)
    }
  }, [isAuthenticated, params.id])

  const fetchOrderDetails = async () => {
    try {
      const response = await apiService.getOrder(params.id)
      setOrder(response)
    } catch (error) {
      console.error('Error fetching order details:', error)
      setError('Failed to load order details')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-warm-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-primary-brown mb-4">Order Details</h1>
            <p className="text-gray-600 mb-8">Please log in to view your order details.</p>
            <Link 
              href="/"
              className="bg-rich-brown text-white px-6 py-3 rounded-lg hover:bg-primary-brown transition-colors"
            >
              Go to Home
            </Link>
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
            <h1 className="text-3xl font-serif text-primary-brown mb-8">Order Details</h1>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-warm-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-primary-brown mb-8">Order Details</h1>
            <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
            <Link 
              href="/orders"
              className="bg-rich-brown text-white px-6 py-3 rounded-lg hover:bg-primary-brown transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-primary-brown">Order Details</h1>
          <Link 
            href="/orders"
            className="text-rich-brown hover:text-primary-brown font-medium"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Order Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">₹{order.total_amount}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items ({order.items?.length || 0})</h3>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.product?.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.product?.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      <span className="font-semibold text-gray-900">₹{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Billing Info */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{order.shipping_address?.name}</p>
                  <p>{order.shipping_address?.address_line_1}</p>
                  {order.shipping_address?.address_line_2 && (
                    <p>{order.shipping_address.address_line_2}</p>
                  )}
                  <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
                  <p>Phone: {order.shipping_address?.phone}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">₹{order.subtotal || order.total_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-900">₹{order.shipping_cost || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-900">₹{order.tax_amount || 0}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">₹{order.total_amount}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payment Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
