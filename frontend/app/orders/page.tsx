// @ts-nocheck
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Star, 
  Download,
  MessageCircle,
  RotateCcw,
  Eye,
  Filter,
  Calendar
} from 'lucide-react'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  seller: string
}

interface Order {
  id: string
  date: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  total: number
  deliveryAddress: string
  estimatedDelivery: string
  trackingNumber?: string
  paymentMethod: string
}

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  // Mock orders data
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      items: [
        {
          id: 1,
          name: 'Bridal Lehenga Collection',
          price: 45999,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1756483510809-122c56fbb035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWhlbmdhJTIwY2hvbGklMjBkZXNpZ25lcnxlbnwxfHx8fDE3NjI3NTkyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
          seller: 'Royal Fashion House'
        }
      ],
      total: 45999,
      deliveryAddress: '123 Main Street, Mumbai, Maharashtra 400001',
      estimatedDelivery: '2024-01-20',
      trackingNumber: 'TRK123456789',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-18',
      status: 'shipped',
      items: [
        {
          id: 2,
          name: 'Silk Saree with Blouse',
          price: 12999,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1715881634011-2c3e0dea96c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8aGFuZGxvb20lMjBzYXJlZSUyMGZhYnJpY3xlbnwxfHx8fDE3NjI3NTkyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
          seller: 'Traditional Weavers'
        },
        {
          id: 3,
          name: 'Premium Gold Jewelry Set',
          price: 35999,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwZ29sZCUyMG5lY2tsYWNlfGVufDF8fHx8MTc2Mjc1OTI2NXww&ixlib=rb-4.1.0&q=80&w=1080',
          seller: 'Golden Arts'
        }
      ],
      total: 48998,
      deliveryAddress: '456 Park Avenue, Mumbai, Maharashtra 400002',
      estimatedDelivery: '2024-01-25',
      trackingNumber: 'TRK987654321',
      paymentMethod: 'UPI'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-20',
      status: 'confirmed',
      items: [
        {
          id: 4,
          name: 'North Indian Thali',
          price: 299,
          quantity: 3,
          image: 'https://images.unsplash.com/photo-1651488201726-bbb9577778ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjByZXN0YXVyYW50fGVufDF8fHx8MTc2Mjc1ODY4OHww&ixlib=rb-4.1.0&q=80&w=1080',
          seller: 'Spice Garden Restaurant'
        }
      ],
      total: 897,
      deliveryAddress: '123 Main Street, Mumbai, Maharashtra 400001',
      estimatedDelivery: '2024-01-21',
      paymentMethod: 'Cash on Delivery'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'confirmed': return <Package className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  const trackOrder = (orderId: string) => {
    alert(`Tracking order ${orderId}...`)
  }

  const downloadInvoice = (orderId: string) => {
    alert(`Downloading invoice for order ${orderId}...`)
  }

  const reorder = (orderId: string) => {
    alert(`Reordering items from order ${orderId}...`)
  }

  const writeReview = (itemId: number) => {
    alert(`Writing review for item ${itemId}...`)
  }

  const contactSeller = (seller: string) => {
    alert(`Contacting ${seller}...`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <Link href="/marketplace">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Order {order.id}
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.trackingNumber && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => trackOrder(order.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadInvoice(order.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">by {item.seller}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                          <div className="flex gap-1 mt-2">
                            {order.status === 'delivered' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => writeReview(item.id)}
                                className="text-xs"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => contactSeller(item.seller)}
                              className="text-xs"
                            >
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Delivery Address</h5>
                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Payment Method</h5>
                        <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                        {order.trackingNumber && (
                          <>
                            <h5 className="font-medium text-gray-900 mb-1 mt-2">Tracking Number</h5>
                            <p className="text-sm text-gray-600 font-mono">{order.trackingNumber}</p>
                          </>
                        )}
                      </div>
                      <div className="text-right">
                        <h5 className="font-medium text-gray-900 mb-1">Order Total</h5>
                        <p className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                        {order.status !== 'cancelled' && (
                          <p className="text-sm text-gray-600 mt-1">
                            Expected: {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-4 flex flex-wrap gap-2">
                    {order.status === 'delivered' && (
                      <Button
                        variant="outline"
                        onClick={() => reorder(order.id)}
                        className="flex items-center gap-1"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reorder
                      </Button>
                    )}
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <Button
                        variant="outline"
                        onClick={() => alert('Order cancellation requested')}
                        className="text-red-600 hover:text-red-700"
                      >
                        Cancel Order
                      </Button>
                    )}
                    {order.status === 'delivered' && (
                      <Button
                        variant="outline"
                        onClick={() => alert('Return request initiated')}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        Return Items
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => alert('Need help with this order?')}
                    >
                      Need Help?
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Summary Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Order Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
                <p className="text-sm text-gray-600">Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length}
                </p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
