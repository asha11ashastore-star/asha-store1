'use client'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-warm-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-primary-brown/10 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-primary-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-4xl font-serif text-primary-brown mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/collections"
              className="inline-block bg-primary-brown text-white px-8 py-3 rounded-lg hover:bg-dark-brown transition-colors font-medium"
            >
              Browse Collections
            </Link>
            <br />
            <Link 
              href="/"
              className="inline-block text-primary-brown hover:underline"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
