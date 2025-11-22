'use client'
import { useState } from 'react'
import { useCart } from './CartProvider'
import CheckoutModal from './CheckoutModal'

export default function CartModal({ isOpen, onClose }) {
  const { items, updateQuantity, removeItem, getTotal } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handleCheckoutSuccess = (result) => {
    alert(`Payment successful! Order ID: ${result.order.order_number}`)
    setIsCheckoutOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-20 px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        
        <div className="relative bg-white w-full max-w-md rounded-lg shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif">Shopping Cart</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.cartId} className="flex items-center space-x-4 pb-4 border-b">
                      <div className="w-20 h-24 bg-gray-100 rounded"></div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">₹{item.price}</p>
                        {item.selectedSize && (
                          <p className="text-xs mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-brown-100 text-brown-800 font-semibold">
                              Size: {item.selectedSize}
                            </span>
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="w-6 h-6 border rounded hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() => {
                              if (item.stock_quantity && item.quantity >= item.stock_quantity) {
                                alert(`Only ${item.stock_quantity} items available in stock!`)
                                return
                              }
                              updateQuantity(item.cartId, item.quantity + 1)
                            }}
                            className="w-6 h-6 border rounded hover:bg-gray-100"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.cartId)}
                            className="ml-4 text-red-500 text-sm hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        {item.stock_quantity && item.stock_quantity <= 5 && (
                          <p className="text-xs text-red-600 mt-1">
                            Only {item.stock_quantity} left in stock!
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>₹{getTotal()}</span>
                  </div>
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full mt-4 bg-primary-brown text-white py-3 rounded-lg hover:bg-dark-brown transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  )
}
