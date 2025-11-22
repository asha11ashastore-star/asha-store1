// @ts-nocheck
'use client'

import { useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClothingSection } from '@/components/marketplace/ClothingSection'
import { EatOutSection } from '@/components/marketplace/EatOutSection'
import { DepartmentalStoreSection } from '@/components/marketplace/DepartmentalStoreSection'
import {
  ShoppingBag,
  Heart,
  Package,
  CreditCard,
  Star,
  Truck,
  MapPin,
  Bell,
  User,
  ShoppingCart,
  Zap,
  TrendingUp,
  Gift,
  Shirt,
  UtensilsCrossed,
  Store
} from 'lucide-react'

interface Order {
  id: string
  items: string[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  date: string
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  category: string
}

type MarketplaceSection = 'overview' | 'clothing' | 'food' | 'grocery'

export default function BuyerDashboard() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<MarketplaceSection>('overview')

  // Mock data - in a real app, this would come from API calls
  const [stats] = useState({
    totalOrders: 12,
    activeOrders: 3,
    totalSpent: 15750,
    rewardPoints: 890
  })

  const [recentOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      items: ['Wireless Headphones', 'Phone Case'],
      total: 2499,
      status: 'shipped',
      date: '2024-01-20'
    },
    {
      id: 'ORD002',
      items: ['Cotton T-Shirt', 'Jeans'],
      total: 1899,
      status: 'delivered',
      date: '2024-01-18'
    },
    {
      id: 'ORD003',
      items: ['Kitchen Utensils Set'],
      total: 999,
      status: 'confirmed',
      date: '2024-01-22'
    }
  ])

  const [recommendations] = useState<Product[]>([
    {
      id: 'P001',
      name: 'Smartphone Accessories',
      price: 799,
      image: 'https://via.placeholder.com/150',
      rating: 4.5,
      category: 'Electronics'
    },
    {
      id: 'P002',
      name: 'Summer Collection Dress',
      price: 1299,
      image: 'https://via.placeholder.com/150',
      rating: 4.7,
      category: 'Fashion'
    },
    {
      id: 'P003',
      name: 'Home Decor Items',
      price: 599,
      image: 'https://via.placeholder.com/150',
      rating: 4.3,
      category: 'Home'
    }
  ])

  useEffect(() => {
    if (user?.role !== 'buyer') {
      router.push('/auth/login')
      return
    }
    setLoading(false)
  }, [user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user?.role !== 'buyer') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need to be a buyer to access this dashboard.</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const marketplaceTabs = [
    { id: 'overview', label: 'Overview', icon: ShoppingBag },
    { id: 'clothing', label: 'Clothing', icon: Shirt },
    { id: 'food', label: 'Food', icon: UtensilsCrossed },
    { id: 'grocery', label: 'Grocery', icon: Store }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.first_name}!
          </h1>
          <p className="text-gray-600">Shop from our complete marketplace with clothing, food, and grocery</p>
        </div>

        {/* Marketplace Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white border border-gray-200 rounded-lg p-1 w-fit">
            {marketplaceTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeSection === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as MarketplaceSection)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content based on active section */}
        {activeSection === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-gray-600">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <Truck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeOrders}</div>
                  <p className="text-xs text-gray-600">Currently processing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString()}</div>
                  <p className="text-xs text-gray-600">This year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
                  <Gift className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.rewardPoints}</div>
                  <p className="text-xs text-gray-600">Available to redeem</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button 
                        onClick={() => setActiveSection('clothing')}
                        className="h-20 flex-col gap-2"
                      >
                        <Shirt className="h-6 w-6" />
                        <span className="text-xs">Clothing</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveSection('food')}
                        className="h-20 flex-col gap-2"
                      >
                        <UtensilsCrossed className="h-6 w-6" />
                        <span className="text-xs">Food</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveSection('grocery')}
                        className="h-20 flex-col gap-2"
                      >
                        <Store className="h-6 w-6" />
                        <span className="text-xs">Grocery</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col gap-2">
                        <User className="h-6 w-6" />
                        <span className="text-xs">Profile</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">#{order.id}</span>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {order.items.join(', ')}
                            </p>
                            <p className="text-xs text-gray-500">
                              Ordered on {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.total.toLocaleString()}</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Order Shipped</p>
                        <p className="text-xs text-blue-700">Your order #ORD001 has been shipped</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900">Delivery Completed</p>
                        <p className="text-xs text-green-700">Order #ORD002 delivered successfully</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-yellow-900">Special Offer</p>
                        <p className="text-xs text-yellow-700">Get 20% off on fashion items</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Recommended for You
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendations.map((product) => (
                        <div key={product.id} className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{product.rating}</span>
                              </div>
                              <span className="text-sm font-semibold">₹{product.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Marketplace Sections */}
        {activeSection === 'clothing' && <ClothingSection />}
        {activeSection === 'food' && <EatOutSection />}
        {activeSection === 'grocery' && <DepartmentalStoreSection />}
      </div>
    </div>
  )
}
