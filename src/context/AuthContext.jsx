import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data)
          fetchWishlist()
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/auth/wishlist')
      setWishlist(res.data.map(item => item._id))
    } catch (error) {
      console.error(error)
    }
  }

  const addToWishlist = async (productId) => {
    try {
      await api.post('/auth/wishlist', { productId })
      setWishlist(prev => [...prev, productId])
    } catch (error) {
      console.error(error)
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/auth/wishlist/${productId}`)
      setWishlist(prev => prev.filter(id => id !== productId))
    } catch (error) {
      console.error(error)
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.includes(productId)
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data)
    fetchWishlist()
    return res.data
  }

  const register = async (email, password, fullName) => {
    const res = await api.post('/auth/register', { email, password, fullName })
    localStorage.setItem('token', res.data.token)
    setUser(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setWishlist([])
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </AuthContext.Provider>
  )
}
