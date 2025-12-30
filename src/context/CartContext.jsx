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

  const addToCart = async (productId, quantity = 1, variantId = null, variantName = null) => {
    try {
      const res = await api.post('/cart/add', { productId, quantity, variantId, variantName })
      setCart(res.data)
    } catch (error) {
      throw error
    }
  }

  const updateQuantity = async (productId, quantity, variantId = null) => {
    try {
      const res = await api.put('/cart/update', { productId, quantity, variantId })
      setCart(res.data)
    } catch (error) {
      throw error
    }
  }

  const removeFromCart = async (productId, variantId = null) => {
    try {
      let url = `/cart/remove/${productId}`
      if (variantId) {
        url += `?variantId=${variantId}`
      }
      const res = await api.delete(url)
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
    let price = item.product?.salePrice || item.product?.price || 0
    if (item.variantId && item.product?.hasVariants) {
      const variant = item.product.variants?.find(v => v._id === item.variantId)
      if (variant) {
        price = variant.salePrice || variant.price || price
      }
    }
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
