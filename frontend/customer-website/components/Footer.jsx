'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate newsletter subscription
    setTimeout(() => {
      setLoading(false)
      setSubscribed(true)
      setEmail('')
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubscribed(false)
      }, 3000)
    }, 1000)
  }
  return (
    <footer className="bg-brown-800 text-cream">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-2xl font-elegant text-cream mb-4 tracking-widest font-medium">Aशा</h3>
            <p className="text-cream/80 mb-4 leading-relaxed">
              Discover timeless beauty with our curated collection of handwoven sarees and traditional Indian wear.
            </p>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/profile.php?id=61583909454081" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-beige-200 hover:text-beige-100 transition-colors"
                title="Follow us on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/asha_21131?igsh=bDhzeWp3eXlvY25q" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-beige-200 hover:text-beige-100 transition-colors"
                title="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C8.396 0 7.929.01 7.262.048 4.85.207 3.285 1.599 2.53 3.45.666 7.806.666 16.207 2.53 20.55c1.595 3.11 4.706 3.45 9.487 3.45 4.782 0 7.893-.34 9.487-3.45 1.864-4.343 1.864-12.744 0-17.1C20.75 1.599 19.185.207 16.773.048 16.106.01 15.639 0 12.017 0zm0 2.17c3.291 0 3.677.014 4.974.072 2.873.128 4.372 1.595 4.502 4.502.058 1.297.072 1.683.072 4.974 0 3.291-.014 3.677-.072 4.974-.13 2.907-1.629 4.374-4.502 4.502-1.297.058-1.683.072-4.974.072-3.291 0-3.677-.014-4.974-.072-2.873-.128-4.372-1.595-4.502-4.502C2.185 15.394 2.17 15.008 2.17 11.717c0-3.291.014-3.677.072-4.974.13-2.907 1.629-4.374 4.502-4.502C8.34 2.185 8.726 2.17 12.017 2.17zm0 3.405c-3.4 0-6.162 2.76-6.162 6.162 0 3.402 2.762 6.162 6.162 6.162 3.402 0 6.162-2.76 6.162-6.162 0-3.402-2.76-6.162-6.162-6.162zM12.017 9.85c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25-2.25-1.01-2.25-2.25 1.01-2.25 2.25-2.25zm4.408-2.533c0 .79-.64 1.43-1.43 1.43-.79 0-1.43-.64-1.43-1.43 0-.79.64-1.43 1.43-1.43.79 0 1.43.64 1.43 1.43z"/>
                </svg>
              </a>
              
              {/* Twitter */}
              <a 
                href="https://share.google/liTaFredBEZjVnvPY" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-beige-200 hover:text-beige-100 transition-colors"
                title="Follow us on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cream uppercase tracking-wide">QUICK LINKS</h4>
            <ul className="space-y-2">
              <li><Link href="/collections" className="text-cream/80 hover:text-cream transition-colors">All Collections</Link></li>
              <li><Link href="/collections?category=saree" className="text-cream/80 hover:text-cream transition-colors">Sarees</Link></li>
              <li><Link href="/collections?category=lehenga" className="text-cream/80 hover:text-cream transition-colors">Lehengas</Link></li>
              <li><Link href="/collections?category=kurti" className="text-cream/80 hover:text-cream transition-colors">Kurtis</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cream uppercase tracking-wide">POLICIES</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-cream/80 hover:text-cream transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-cream/80 hover:text-cream transition-colors">Contact Us</Link></li>
              <li><Link href="/size-guide" className="text-cream/80 hover:text-cream transition-colors">Size Guide</Link></li>
              <li><Link href="/shipping" className="text-cream/80 hover:text-cream transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="text-cream/80 hover:text-cream transition-colors">Return Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cream uppercase tracking-wide">NEWSLETTER</h4>
            <p className="text-cream/80 mb-4">Subscribe to receive updates and exclusive offers</p>
            {subscribed ? (
              <div className="bg-green-600 text-white p-3 rounded-lg text-center">
                ✓ Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-maroon text-white placeholder-white/70"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-maroon text-white px-4 py-2 rounded-r-lg hover:bg-dark-maroon transition-colors uppercase tracking-wider text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-brown-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm">© 2025 Aशा - Grace Woven by Asha Dhaundiyal. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-white hover:text-gray-200 text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-white hover:text-gray-200 text-sm transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
