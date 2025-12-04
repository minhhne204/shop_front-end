import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCart({ items: [] })
    }
  }, [user])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await api.get('/cart')
      setCart(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post('/cart/add', { productId, quantity })
      setCart(res.data)
    } catch (error) {
      throw error
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.put('/cart/update', { productId, quantity })
      setCart(res.data)
    } catch (error) {
      throw error
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`)
      setCart(res.data)
    } catch (error) {
      throw error
    }
  }

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear')
      setCart({ items: [] })
    } catch (error) {
      throw error
    }
  }

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.items.reduce((sum, item) => {
    const price = item.product?.salePrice || item.product?.price || 0
    return sum + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}
