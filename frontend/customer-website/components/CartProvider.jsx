'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import apiService from '../services/api'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product) => {
    // Check if product has stock information
    const availableStock = product.stock_quantity || product.stock || 0
    
    setItems(prevItems => {
      // Check for existing item with same id AND same size
      const existingItem = prevItems.find(item => 
        item.id === product.id && item.selectedSize === product.selectedSize
      )
      const quantityToAdd = product.quantity || 1
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd
        
        // Check if new quantity exceeds available stock
        if (newQuantity > availableStock) {
          alert(`Cannot add more items. Only ${availableStock} in stock. You already have ${existingItem.quantity} in your cart.`)
          return prevItems // Don't add, return existing items
        }
        
        return prevItems.map(item =>
          (item.id === product.id && item.selectedSize === product.selectedSize)
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
      
      // For new item, check if quantity exceeds stock
      if (quantityToAdd > availableStock) {
        alert(`Cannot add ${quantityToAdd} items. Only ${availableStock} in stock.`)
        return prevItems // Don't add
      }
      
      // Add unique cartId for items with different sizes
      const cartId = `${product.id}_${product.selectedSize || 'nosize'}_${Date.now()}`
      return [...prevItems, { ...product, quantity: quantityToAdd, cartId }]
    })
  }

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(cartId)
      return
    }
    
    setItems(prevItems => {
      const item = prevItems.find(i => i.cartId === cartId)
      if (!item) return prevItems
      
      // Check stock limit
      const availableStock = item.stock_quantity || item.stock || 0
      if (newQuantity > availableStock) {
        alert(`Cannot set quantity to ${newQuantity}. Only ${availableStock} in stock.`)
        return prevItems // Don't update
      }
      
      return prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    })
  }

  const removeItem = (cartId) => {
    setItems(prevItems => prevItems.filter(item => item.cartId !== cartId))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''))
      return total + (price * item.quantity)
    }, 0).toFixed(2)
  }

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
