'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import { useAuth } from '../../../contexts/AuthContext'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState(null)
  const [sessionRestored, setSessionRestored] = useState(false)
  const { refreshUser, user, isLoading } = useAuth()
  
  // Log current user and loading state whenever they change
  useEffect(() => {
    console.log('💳 ⏱️ AUTH STATE CHANGED:')
    console.log('   isLoading:', isLoading)
    console.log('   sessionRestored:', sessionRestored)
    console.log('   user:', user ? user.email : 'null')
    
    if (user) {
      console.log('💳 👤 CURRENT USER DISPLAYED:', user.email)
      console.log('💳 👤 User ID:', user.id)
      console.log('💳 👤 Username:', user.username)
      console.log('💳 👤 First Name:', user.first_name)
    } else if (!isLoading) {
      console.log('💳 👤 NO USER DISPLAYED (Guest checkout)')
    } else {
      console.log('💳 ⏳ Still loading auth...')
    }
  }, [user, isLoading, sessionRestored])
  
  // Check session status after payment redirect
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('💳 ========================================')
        console.log('💳 PAYMENT SUCCESS PAGE - VERIFYING USER')
        console.log('💳 ========================================')
        
        // CRITICAL: Check multiple sources for customer email
        const urlEmail = searchParams.get('email')
        const pendingEmail = localStorage.getItem('pending_payment_email')
        const pendingTime = localStorage.getItem('pending_payment_time')
        
        console.log('💳 Email from URL:', urlEmail || 'None')
        console.log('💳 Email from pending payment:', pendingEmail || 'None')
        
        // Use the most reliable email source
        const customerEmail = urlEmail || pendingEmail
        
        let token = localStorage.getItem('auth_token')
        let savedUser = localStorage.getItem('user_data')
        
        console.log('💳 Token in localStorage:', !!token)
        console.log('💳 SavedUser in localStorage:', !!savedUser)
        
        // CRITICAL: If localStorage is empty, try multiple restoration methods
        if (!token || !savedUser) {
          console.log('⚠️ localStorage is empty! Trying restoration methods...')
          
          // Method 1: Check sessionStorage backup
          const tokenBackup = sessionStorage.getItem('auth_token_backup')
          const userBackup = sessionStorage.getItem('user_data_backup')
          
          if (tokenBackup && userBackup) {
            console.log('🔄 METHOD 1: Restoring from sessionStorage backup!')
            token = tokenBackup
            savedUser = userBackup
            
            // Restore to localStorage
            localStorage.setItem('auth_token', token)
            localStorage.setItem('user_data', savedUser)
            console.log('✅ RESTORED auth data from sessionStorage!')
            console.log('✅ Restored user:', JSON.parse(savedUser).email)
            
            // Clear backup after restore
            sessionStorage.removeItem('auth_token_backup')
            sessionStorage.removeItem('user_data_backup')
          } 
          // Method 2: Check cookies for backup
          else {
            console.log('🔄 METHOD 2: Checking cookies for backup...')
            console.log('🍪 All cookies:', document.cookie)
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
              const [key, value] = cookie.trim().split('=')
              acc[key] = value
              return acc
            }, {})
            console.log('🍪 Parsed cookies:', Object.keys(cookies))
            
            const cookieToken = cookies['auth_backup_token']
            const cookieUser = cookies['auth_backup_user']
            const cookieEmail = cookies['auth_backup_email']
            
            console.log('🍪 Found auth_backup_token:', !!cookieToken)
            console.log('🍪 Found auth_backup_user:', !!cookieUser)
            console.log('🍪 Found auth_backup_email:', cookieEmail || 'None')
            
            if (cookieToken && cookieUser) {
              console.log('✅ Found backup in cookies!')
              token = cookieToken
              savedUser = decodeURIComponent(cookieUser)
              
              // Restore to localStorage
              localStorage.setItem('auth_token', token)
              localStorage.setItem('user_data', savedUser)
              console.log('✅ RESTORED auth data from cookies!')
              console.log('✅ Restored user:', JSON.parse(savedUser).email)
              
              // Clear cookie backups
              document.cookie = 'auth_backup_token=; path=/; max-age=0'
              document.cookie = 'auth_backup_user=; path=/; max-age=0'
              document.cookie = 'auth_backup_email=; path=/; max-age=0'
            }
            // Method 3: AUTO-REDIRECT TO LOGIN with email pre-filled
            else if (customerEmail) {
              console.log('🔄 METHOD 3: Auto-redirecting to login for:', customerEmail)
              console.log('💡 User will be redirected to login page')
              
              // Store email and redirect destination
              sessionStorage.setItem('login_email', customerEmail)
              sessionStorage.setItem('redirect_after_login', window.location.pathname + window.location.search)
              
              // Clear pending payment data
              localStorage.removeItem('pending_payment_email')
              localStorage.removeItem('pending_payment_time')
              
              // AUTO-REDIRECT to login after 2 seconds
              console.log('⏰ Redirecting to login in 2 seconds...')
              setTimeout(() => {
                window.location.href = '/auth/login'
              }, 2000)
            } 
            else {
              console.log('❌ No backup found in any method!')
              console.log('❌ Cannot restore session - showing guest checkout')
            }
          }
        } else {
          console.log('✅ Auth data exists in localStorage')
          // Clear any old backups and pending payments
          sessionStorage.removeItem('auth_token_backup')
          sessionStorage.removeItem('user_data_backup')
          localStorage.removeItem('pending_payment_email')
          localStorage.removeItem('pending_payment_time')
          document.cookie = 'auth_backup_token=; path=/; max-age=0'
          document.cookie = 'auth_backup_user=; path=/; max-age=0'
          document.cookie = 'auth_backup_email=; path=/; max-age=0'
        }
        
        if (token) {
          console.log('💳 Token found (first 10 chars):', token.substring(0, 10) + '...')
          
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser)
              console.log('💳 localStorage has user:', userData.email)
              console.log('💳 localStorage user ID:', userData.id)
            } catch (e) {
              console.error('💳 Failed to parse saved user data')
            }
          }
          
          // CRITICAL: Try multiple times to verify user
          let attempts = 0
          const maxAttempts = 3
          let verifiedUser = null
          
          while (attempts < maxAttempts && !verifiedUser) {
            attempts++
            console.log(`💳 Verification attempt ${attempts}/${maxAttempts}...`)
            
            try {
              const freshUser = await refreshUser()
              verifiedUser = freshUser
              console.log('💳 ✅ API VERIFIED USER:', freshUser?.email)
              console.log('💳 ✅ User ID:', freshUser?.id)
              console.log('💳 ✅ Username:', freshUser?.username)
              console.log('💳 ✅ SESSION RESTORED - User authenticated')
              break
            } catch (error) {
              console.error(`💳 ❌ Attempt ${attempts} failed:`, error.message)
              
              if (attempts < maxAttempts) {
                console.log(`💳 ⏳ Waiting 1 second before retry...`)
                await new Promise(resolve => setTimeout(resolve, 1000))
              } else {
                console.error('💳 ❌ All verification attempts failed')
                console.warn('💳 ⚠️ Using localStorage as fallback')
                
                // If all attempts fail, at least try to use localStorage
                if (savedUser) {
                  try {
                    const cachedUser = JSON.parse(savedUser)
                    console.log('💳 📦 Using cached user from localStorage:', cachedUser.email)
                    verifiedUser = cachedUser
                  } catch (e) {
                    console.error('💳 ❌ Failed to use cached user:', e)
                  }
                }
              }
            }
          }
          
          // Give extra time for state updates to propagate
          await new Promise(resolve => setTimeout(resolve, 500))
          
        } else {
          console.log('💳 ℹ️ No token - Guest checkout')
        }
        
        // CRITICAL: Verify user matches order email
        const orderEmail = sessionStorage.getItem('last_order_email')
        if (orderEmail && user) {
          console.log('🔍 VERIFICATION: Order email:', orderEmail)
          console.log('🔍 VERIFICATION: Displayed user:', user.email)
          
          if (orderEmail !== user.email) {
            console.error('🚨 CRITICAL: USER MISMATCH!')
            console.error('🚨 Order was for:', orderEmail)
            console.error('🚨 But showing user:', user.email)
            console.error('🚨 This is THE BUG the user reported!')
            
            // Try to fix by finding correct user in backup
            const userBackup = sessionStorage.getItem('user_data_backup')
            if (userBackup) {
              try {
                const backupUser = JSON.parse(userBackup)
                if (backupUser.email === orderEmail) {
                  console.log('✅ Found correct user in backup! Restoring...')
                  localStorage.setItem('user_data', userBackup)
                  // Force page reload to trigger AuthContext refresh
                  console.log('🔄 Reloading page to fix user mismatch...')
                  setTimeout(() => window.location.reload(), 100)
                }
              } catch (e) {
                console.error('Failed to restore from backup:', e)
              }
            } else {
              console.error('❌ No backup available to fix mismatch!')
              console.error('❌ Please refresh the page manually')
            }
          } else {
            console.log('✅ VERIFICATION PASSED: User matches order!')
          }
        }
        
        console.log('💳 ========================================')
        console.log('💳 FINAL USER:', user?.email || 'No user')
        if (orderEmail) {
          console.log('💳 ORDER EMAIL:', orderEmail)
        }
        console.log('💳 ========================================')
      } catch (error) {
        console.error('💳 ❌ Session check error:', error)
      } finally {
        setSessionRestored(true)
      }
    }
    
    // Longer delay after payment redirect to ensure AuthContext fully initializes
    const timer = setTimeout(checkSession, 1500)
    return () => clearTimeout(timer)
  }, [refreshUser])

  useEffect(() => {
    const updateOrderStatus = async () => {
      // Get order details from URL params (from Razorpay callback)
      const orderNumber = searchParams.get('order') || searchParams.get('order_id')
      const paymentId = searchParams.get('payment_id') || searchParams.get('razorpay_payment_id')
      const paymentLinkId = searchParams.get('razorpay_payment_link_id')
      const paymentLinkStatus = searchParams.get('razorpay_payment_link_status')
      
      console.log('Payment Success Page - URL Params:', {
        orderNumber,
        paymentId,
        paymentLinkId,
        paymentLinkStatus,
        allParams: Object.fromEntries(searchParams.entries())
      })
      
      // Update order status to PAID immediately
      if (orderNumber) {
        try {
          console.log('🔄 Updating order status to PAID for:', orderNumber)
          
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://asha-store-backend.onrender.com'
          const response = await fetch(`${API_BASE_URL}/api/v1/guest-orders/${orderNumber}/mark-paid`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              payment_id: paymentId || paymentLinkId || 'razorpay_payment',
              payment_link_id: paymentLinkId,
              payment_link_status: paymentLinkStatus || 'paid'
            })
          })
          
          if (response.ok) {
            console.log('✅ Order marked as PAID successfully!')
          } else {
            console.warn('⚠️ Failed to update order status:', await response.text())
          }
        } catch (error) {
          console.warn('⚠️ Error updating order status:', error)
          // Continue anyway - order was created, just status update failed
        }
      }
            // Clear cart after successful payment
      if (orderNumber) {
        try {
          localStorage.removeItem('cart')
          // Dispatch custom event to update cart count
          window.dispatchEvent(new Event('cartUpdated'))
          console.log('✅ Cart cleared after successful payment')
          console.log('✅ Order saved to database - visible in My Orders')
        } catch (e) {
          console.warn('Could not clear cart:', e)
        }
      } else {
        console.warn('No order number in URL params - user may have navigated here directly')
      }
      
      if (orderNumber) {
        setOrderDetails({
          orderId: orderNumber,
          paymentId: paymentId || paymentLinkId || 'Processing...',
          timestamp: new Date().toLocaleString()
        })
      } else {
        // No order number - check sessionStorage for pending order
        try {
          const pendingOrder = sessionStorage.getItem('pendingOrder')
          if (pendingOrder) {
            const order = JSON.parse(pendingOrder)
            setOrderDetails({
              orderId: order.orderNumber,
              paymentId: 'Payment Completed',
              timestamp: new Date(order.timestamp).toLocaleString()
            })
            sessionStorage.removeItem('pendingOrder')
          }
        } catch (e) {
          console.warn('Could not load pending order:', e)
        }
      }
    }
    
    updateOrderStatus()
  }, [searchParams])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-beige-50 to-cream py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-serif text-primary-brown mb-4">
              Payment Successful! 🎉
            </h1>
            
            <p className="text-gray-600 mb-8 text-lg">
              Thank you for your purchase! Your order has been confirmed and we'll start processing it right away.
            </p>

            {/* Order Details */}
            {orderDetails && (
              <div className="bg-beige-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-primary-brown mb-4">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-mono font-bold text-lg text-primary-brown">#{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium">{orderDetails.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-medium">{orderDetails.timestamp}</span>
                  </div>
                </div>
                
                {/* Important Notice */}
                <div className="mt-4 pt-4 border-t border-beige-200">
                  <p className="text-xs text-gray-600">
                    <strong className="text-primary-brown">📝 Save your order number!</strong>
                    <br />
                    You can track your order anytime in "My Orders" section or contact us with your order number.
                  </p>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-amber-800 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You'll receive an order confirmation email shortly
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  We'll carefully prepare your handwoven items
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Shipping details will be sent once your order is dispatched
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Expected delivery: 5-7 business days
                </li>
              </ul>
            </div>

            {/* Session Status Indicator */}
            {(!sessionRestored || isLoading) && (
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-brown"></div>
                  {isLoading ? 'Loading your account...' : 'Restoring your session...'}
                </div>
              </div>
            )}
            
            {sessionRestored && !isLoading && user && (
              <div className="mb-4 text-center bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-lg text-green-700 font-bold mb-2">
                  Logged in as: {user.email}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  🎉 Your order is linked to this account
                </p>
                <div className="mt-3 pt-3 border-t border-green-200 text-xs text-gray-600 space-y-1">
                  <p><strong>Name:</strong> {user.first_name} {user.last_name || ''}</p>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p className="text-green-600"><strong>✓ Token Valid</strong></p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 text-xs text-gray-600 hover:text-gray-800 underline"
                >
                  Wrong account? Click to refresh
                </button>
              </div>
            )}
            
            {sessionRestored && !isLoading && !user && (
              <div className="mb-4 text-center bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="text-2xl mb-2">ℹ️</div>
                {(() => {
                  const expectedEmail = sessionStorage.getItem('expected_login_email')
                  if (expectedEmail) {
                    return (
                      <div className="bg-green-100 border-2 border-green-400 rounded-lg p-6">
                        <div className="text-3xl mb-3">✅</div>
                        <p className="text-lg text-green-800 font-bold mb-3">
                          Payment Successful!
                        </p>
                        <div className="bg-white rounded-lg p-4 mb-4">
                          <p className="text-sm text-gray-600 mb-1">
                            Order placed with:
                          </p>
                          <p className="text-base font-bold text-gray-900">
                            {expectedEmail}
                          </p>
                        </div>
                        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-4">
                          <p className="text-sm text-amber-800 font-semibold mb-1">
                            🔄 Redirecting to login...
                          </p>
                          <p className="text-xs text-amber-700">
                            Your email will be pre-filled
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 text-center">
                          After login, you'll see your order in "My Orders"
                        </p>
                      </div>
                    )
                  } else {
                    return (
                      <>
                        <p className="text-base text-amber-700 font-semibold mb-2">
                          Guest Checkout
                        </p>
                        <p className="text-sm text-gray-600">
                          Order saved with your contact details
                        </p>
                      </>
                    )
                  }
                })()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link 
                  href="/orders"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
                >
                  📦 View My Orders
                </Link>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    {sessionStorage.getItem('expected_login_email') 
                      ? `Login to view your order in your account` 
                      : `Your order is saved. Login to track it.`}
                  </p>
                  <Link 
                    href="/orders"
                    className="bg-gray-400 text-white px-8 py-3 rounded-lg font-medium cursor-not-allowed inline-block opacity-60"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Please login first to view your orders')
                    }}
                  >
                    📦 View My Orders (Login Required)
                  </Link>
                </div>
              )}
              
              <Link 
                href="/collections"
                className="bg-primary-brown text-white px-8 py-3 rounded-lg font-medium hover:bg-dark-brown transition-colors"
              >
                Continue Shopping
              </Link>
              
              <button
                onClick={() => router.push('/')}
                className="bg-beige-200 text-primary-brown px-8 py-3 rounded-lg font-medium hover:bg-beige-300 transition-colors"
              >
                Return Home
              </button>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-beige-200">
              <p className="text-sm text-gray-600">
                Questions about your order? 
                <br />
                Contact us at{' '}
                <Link href="mailto:asha11ashastore@gmail.com" className="text-primary-brown hover:underline">
                  asha11ashastore@gmail.com
                </Link>
                {' '}or call{' '}
                <Link href="tel:+91-9818174388" className="text-primary-brown hover:underline">
                  +91-9818174388
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
