'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Menu, 
  X, 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Bell,
  MapPin,
  Phone,
  Mail,
  ChevronDown
} from 'lucide-react'

export function Navbar() {
  const { user, isAuthenticated } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/categories/clothing', label: 'Clothing' },
   
    
    { href: '/sellers', label: 'Sellers' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ]

  const getDashboardLink = () => {
    if (!user) return '/auth/login'
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard'
      case 'seller':
        return '/seller/dashboard'
      case 'buyer':
        return '/buyer/dashboard'
      default:
        return '/auth/login'
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>support@shopall.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3" />
                <span>Free Delivery Nationwide</span>
              </div>
              {!isAuthenticated && (
                <Link href="/sellers/register" className="hover:text-blue-400 transition-colors">
                  Become a Seller
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ShopAll</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationLinks.slice(0, 5).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {navigationLinks.slice(5).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button (Mobile) */}
              <button className="md:hidden p-2 text-gray-600 hover:text-blue-600">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              {isAuthenticated && (
                <Link href="/notifications" className="relative p-2 text-gray-600 hover:text-blue-600">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-5 h-5 flex items-center justify-center rounded-full">
                    3
                  </Badge>
                </Link>
              )}

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-blue-600">
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-5 h-5 flex items-center justify-center rounded-full">
                  5
                </Badge>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600">
                <ShoppingBag className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 min-w-5 h-5 flex items-center justify-center rounded-full">
                  2
                </Badge>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600">
                    <User className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <Link href={getDashboardLink()} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      Orders
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      Settings
                    </Link>
                    <div className="border-t border-gray-100">
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
