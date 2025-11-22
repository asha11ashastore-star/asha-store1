'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Settings, 
  Bell,
  Search,
  LogOut,
  User,
  BarChart3,
  Heart,
  MapPin,
  Gift
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  role: 'admin' | 'seller' | 'buyer'
}

export default function DashboardLayout({ children, title, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const getNavigationItems = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
          { name: 'Users', href: '/admin/users', icon: Users },
          { name: 'Sellers', href: '/admin/sellers', icon: Package },
          { name: 'Products', href: '/admin/products', icon: Package },
          { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
          { name: 'Payments', href: '/admin/payments', icon: DollarSign },
          { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
          { name: 'Settings', href: '/admin/settings', icon: Settings },
        ]
      case 'seller':
        return [
          { name: 'Dashboard', href: '/seller/dashboard', icon: Home },
          { name: 'Products', href: '/seller/products', icon: Package },
          { name: 'Orders', href: '/seller/orders', icon: ShoppingCart },
          { name: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
          { name: 'Payouts', href: '/seller/payouts', icon: DollarSign },
          { name: 'Profile', href: '/seller/profile', icon: User },
          { name: 'Settings', href: '/seller/settings', icon: Settings },
        ]
      case 'buyer':
        return [
          { name: 'Dashboard', href: '/buyer/dashboard', icon: Home },
          { name: 'Orders', href: '/buyer/orders', icon: ShoppingCart },
          { name: 'Wishlist', href: '/buyer/wishlist', icon: Heart },
          { name: 'Addresses', href: '/buyer/addresses', icon: MapPin },
          { name: 'Rewards', href: '/buyer/rewards', icon: Gift },
          { name: 'Profile', href: '/buyer/profile', icon: User },
          { name: 'Settings', href: '/buyer/settings', icon: Settings },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">ShopAll</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Icon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                    {item.name}
                  </a>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">ShopAll</h1>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                role === 'admin' ? 'bg-red-100 text-red-800' :
                role === 'seller' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    {item.name}
                  </a>
                )
              })}
            </nav>
          </div>
          
          {/* User info */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.first_name} {user?.last_name}
                </p>
                <button
                  onClick={logout}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
                    placeholder="Search..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Bell className="h-6 w-6" />
              </button>
              
              <div className="ml-3 relative">
                <div className="flex items-center text-sm">
                  <span className="text-gray-700 mr-2">{user?.first_name}</span>
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
