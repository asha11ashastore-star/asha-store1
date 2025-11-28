'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [autoFilledEmail, setAutoFilledEmail] = useState(false)

  // Pre-fill email if coming from payment success page
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('login_email')
    if (savedEmail) {
      console.log('✅ Pre-filling email from session:', savedEmail)
      setEmail(savedEmail)
      setAutoFilledEmail(true)
      // Clear it so it doesn't persist
      sessionStorage.removeItem('login_email')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      
      // Check if there's a redirect destination (from payment success)
      const redirectTo = sessionStorage.getItem('redirect_after_login')
      if (redirectTo) {
        console.log('✅ Redirecting back to:', redirectTo)
        sessionStorage.removeItem('redirect_after_login')
        router.push(redirectTo)
      } else {
        // Default redirect to home
        router.push('/')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-beige-50">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif text-primary-brown mb-2">Welcome Back</h1>
              <p className="text-gray-600">
                {autoFilledEmail ? 'Login to view your order' : 'Login to your account to continue shopping'}
              </p>
            </div>

            {autoFilledEmail && (
              <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-400 rounded-lg">
                <p className="text-sm text-amber-900 font-bold mb-2">⚠️ IMPORTANT: Login with the correct email!</p>
                <p className="text-sm text-amber-800 font-semibold">✅ Payment Successful!</p>
                <p className="text-sm text-amber-700 mt-1">
                  Your order was placed with <strong>{email}</strong>
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  You MUST login with this email to see your order!
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address {autoFilledEmail && <span className="text-amber-600">(locked for your order)</span>}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={autoFilledEmail}
                  disabled={autoFilledEmail}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    autoFilledEmail 
                      ? 'border-amber-400 bg-amber-50 cursor-not-allowed font-semibold text-amber-900' 
                      : 'border-gray-300 focus:ring-2 focus:ring-primary-brown focus:border-transparent'
                  }`}
                  placeholder="you@example.com"
                />
                {autoFilledEmail && (
                  <div className="mt-2">
                    <p className="text-xs text-amber-600 font-medium">
                      🔒 This is the email used for your order. Cannot be changed.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.removeItem('login_email')
                        sessionStorage.removeItem('redirect_after_login')
                        window.location.href = '/auth/login'
                      }}
                      className="mt-2 text-xs text-primary-brown underline hover:text-brown-700"
                    >
                      Used wrong email? Click here to login with a different account
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push('/auth/forgot-password')}
                    className="text-sm text-primary-brown hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-brown focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-brown text-white py-3 rounded-lg hover:bg-dark-brown transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="text-primary-brown hover:underline font-semibold"
                >
                  Create Account
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
