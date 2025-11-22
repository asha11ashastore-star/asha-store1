'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import SearchModal from './SearchModal'
import LoginModal from './LoginModal'
import CartModal from './CartModal'
import { useCart } from './CartProvider'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSareeDropdownOpen, setIsSareeDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)
  const userDropdownRef = useRef(null)

  const handleLogout = async () => {
    await logout()
    setIsUserDropdownOpen(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <header className="bg-cream">
        {/* Top Section with Logo and Icons */}
        <div className="border-b border-primary-brown/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Left Side - Hamburger on Mobile, Search on Desktop */}
              <div className="flex items-center min-w-[80px]">
                {/* Hamburger Menu - Mobile Only */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden text-rich-brown hover:text-primary-brown transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
                
                {/* Search Icon - Desktop Only */}
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden md:block text-rich-brown hover:text-primary-brown transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Center Logo */}
              <div className="flex flex-col items-center">
                <Link href="/" className="text-center">
                  <h1 className="text-4xl font-elegant font-medium tracking-widest" style={{ color: '#8B2E2E' }}>Aशा</h1>
                  <p className="text-sm mt-2 font-sans tracking-wide font-normal" style={{ color: '#A89878' }}>Grace Woven by Asha Dhaundiyal</p>
                </Link>
              </div>

              {/* Right Icons */}
              <div className="flex items-center justify-end space-x-3 min-w-[80px]">
                {/* User Account - Login/Profile */}
                <div className="relative" ref={userDropdownRef}>
                  {isAuthenticated ? (
                    <>
                      <button 
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="text-rich-brown hover:text-primary-brown transition-colors flex items-center space-x-1 p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* User Dropdown Menu */}
                      <div 
                        className={`absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border border-gray-200 rounded-lg transition-all duration-200 z-50 ${isUserDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                      >
                        <div className="p-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-600">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link 
                            href="/orders" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            My Orders
                          </Link>
                          <Link 
                            href="/profile" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            My Profile
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsLoginOpen(true)}
                      className="text-rich-brown hover:text-primary-brown transition-colors p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Cart Icon */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="text-rich-brown hover:text-primary-brown transition-colors relative p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop Only */}
        <nav className="hidden md:block border-b border-primary-brown/20 bg-primary-brown">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center space-x-8 py-3">
              {/* Sarees Dropdown */}
              <div className="relative">
                <button 
                  className="text-cream hover:text-white text-sm tracking-wider flex items-center font-medium"
                  onMouseEnter={() => setIsSareeDropdownOpen(true)}
                  onMouseLeave={() => setIsSareeDropdownOpen(false)}
                >
                  SAREES
                  <svg 
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${isSareeDropdownOpen ? 'rotate-180' : 'rotate-0'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-[600px] bg-white shadow-xl border border-gray-200 transition-all duration-200 z-50 ${
                    isSareeDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                  onMouseEnter={() => setIsSareeDropdownOpen(true)}
                  onMouseLeave={() => setIsSareeDropdownOpen(false)}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {/* All Sarees */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">ALL SAREES</h3>
                        <Link href="/collections?category=saree" className="block text-gray-600 hover:text-gray-900 text-sm mb-2">
                          View All Sarees
                        </Link>
                      </div>
                      
                      {/* Shop by Fabric */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">SHOP BY FABRIC</h3>
                        <div className="space-y-2">
                          <Link href="/collections?category=cotton_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Cotton</Link>
                          <Link href="/collections?category=silk_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Silk</Link>
                          <Link href="/collections?category=linen_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Linen</Link>
                        </div>
                      </div>
                      
                      {/* Shop by Weave */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">SHOP BY WEAVE</h3>
                        <div className="space-y-2">
                          <Link href="/collections?category=kantha_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Kantha</Link>
                          <Link href="/collections?category=jamdani_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Jamdani</Link>
                          <Link href="/collections?category=handloom_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Handloom</Link>
                          <Link href="/collections?category=shibori_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Tie N Dye (Shibori)</Link>
                          <Link href="/collections?category=handblock_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Handblock</Link>
                          <Link href="/collections?category=batik_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Batik</Link>
                          <Link href="/collections?category=ajrakh_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Ajrakh</Link>
                          <Link href="/collections?category=khadi_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Khadi</Link>
                          <Link href="/collections?category=tissue_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Tissue</Link>
                          <Link href="/collections?category=jacquard_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Jacquard</Link>
                          <Link href="/collections?category=kota_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Kota</Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Shop by Variety - Second Row */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm">SHOP BY VARIETY</h3>
                      <div className="grid grid-cols-4 gap-4">
                        <Link href="/collections?category=handloom_cotton_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Handloom Cotton</Link>
                        <Link href="/collections?category=tangail_cotton_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Tangail Cotton</Link>
                        <Link href="/collections?category=handloom_silk_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Handloom Silk</Link>
                        <Link href="/collections?category=matka_silk_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Matka Silk</Link>
                        <Link href="/collections?category=tussar_silk_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Tussar Silk</Link>
                        <Link href="/collections?category=muslin_silk_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Muslin Silk</Link>
                        <Link href="/collections?category=katan_silk_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Katan Silk</Link>
                        <Link href="/collections?category=dhakil_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Dhakil</Link>
                        <Link href="/collections?category=mulberry_silk_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Mulberry Silk</Link>
                        <Link href="/collections?category=dhonekali_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Dhonekali</Link>
                        <Link href="/collections?category=satin_silk_saree" className="block text-gray-600 hover:text-gray-900 text-sm">Satin Silk</Link>
                      </div>
                    </div>
                    
                    {/* Price Filter */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm">PRICE RANGE</h3>
                      <div className="flex items-center space-x-4">
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="0">₹0</option>
                          <option value="1000">₹1,000</option>
                          <option value="2000">₹2,000</option>
                          <option value="5000">₹5,000</option>
                        </select>
                        <span className="text-gray-500">to</span>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="10000">₹10,000</option>
                          <option value="20000">₹20,000</option>
                          <option value="50000">₹50,000</option>
                          <option value="100000">₹1,00,000+</option>
                        </select>
                      </div>
                      <button className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors">
                        CLEAR FILTERS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <Link href="/collections?category=kurti" className="text-cream hover:text-white text-sm tracking-wider font-medium">
                KURTA SET
              </Link>
              <Link href="/collections?category=dupatta" className="text-cream hover:text-white text-sm tracking-wider font-medium">
                DUPATTA & STOLES
              </Link>
              <Link href="/sale" className="text-cream hover:text-white text-sm tracking-wider font-medium">
                SALE
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Mobile Only */}
        <div className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[calc(100vh-200px)] overflow-y-auto' : 'max-h-0 overflow-hidden'}`}>
          <div className="px-4 py-4 pb-8 space-y-4">
            {/* Search on Mobile */}
            <button
              onClick={() => {
                setIsSearchOpen(true)
                setIsMobileMenuOpen(false)
              }}
              className="w-full flex items-center space-x-3 text-gray-700 hover:text-primary-brown py-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-medium">Search</span>
            </button>

            {/* All Sarees */}
            <Link 
              href="/collections?category=saree"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-primary-brown py-2 font-medium"
            >
              All Sarees
            </Link>

            {/* Kurta Set */}
            <Link 
              href="/collections?category=kurti"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-primary-brown py-2 font-medium"
            >
              Kurta Set
            </Link>

            {/* Dupatta & Stoles */}
            <Link 
              href="/collections?category=dupatta"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-primary-brown py-2 font-medium"
            >
              Dupatta & Stoles
            </Link>

            {/* Sale */}
            <Link 
              href="/sale"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-primary-brown py-2 font-medium"
            >
              Sale
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Shop by Fabric</p>
              <div className="space-y-3 pl-4">
                <Link href="/collections?category=cotton_saree" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Cotton Sarees</Link>
                <Link href="/collections?category=silk_saree" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Silk Sarees</Link>
                <Link href="/collections?category=linen_saree" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Linen Sarees</Link>
              </div>
            </div>

            {/* Shop by Weave */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Shop by Weave</p>
              <div className="space-y-3 pl-4">
                <Link href="/collections?weave=kantha" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Kantha</Link>
                <Link href="/collections?weave=jamdani" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Jamdani</Link>
                <Link href="/collections?weave=handloom" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Handloom</Link>
                <Link href="/collections?weave=shibori" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Tie N Dye (Shibori)</Link>
                <Link href="/collections?weave=handblock" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Handblock</Link>
                <Link href="/collections?weave=batik" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Batik</Link>
                <Link href="/collections?weave=ajrakh" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Ajrakh</Link>
                <Link href="/collections?weave=khadi" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Khadi</Link>
                <Link href="/collections?weave=tissue" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Tissue</Link>
                <Link href="/collections?weave=jacquard" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Jacquard</Link>
                <Link href="/collections?weave=kota" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Kota</Link>
              </div>
            </div>

            {/* Shop by Variety */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Shop by Variety</p>
              <div className="space-y-3 pl-4">
                <Link href="/collections?variety=handloom_cotton" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Handloom Cotton</Link>
                <Link href="/collections?variety=tangail_cotton" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Tangail Cotton</Link>
                <Link href="/collections?variety=handloom_silk" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Handloom Silk</Link>
                <Link href="/collections?variety=matka_silk" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Matka Silk</Link>
                <Link href="/collections?variety=tussar_silk" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Tussar Silk</Link>
                <Link href="/collections?variety=muslin_silk" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Muslin Silk</Link>
                <Link href="/collections?variety=katan_silk" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Katan Silk</Link>
                <Link href="/collections?variety=dhakii" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Dhakii</Link>
                <Link href="/collections?variety=mulberry_silk" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Mulberry Silk</Link>
                <Link href="/collections?variety=dhonekali" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Dhonekali</Link>
                <Link href="/collections?variety=satin_silk" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm text-gray-600 hover:text-primary-brown">Satin Silk</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
