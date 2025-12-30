import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Loading from '../components/Loading'

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { addToCart } = useCart()

  useEffect(() => {
    if (user) {
      fetchWishlist()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/auth/wishlist')
      setWishlist(res.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/auth/wishlist/${productId}`)
      setWishlist(prev => prev.filter(item => item._id !== productId))
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddToCart = async (product) => {
    if (product.hasVariants && product.variants?.length > 0) {
      window.location.href = `/san-pham/${product.slug}`
      return
    }
    try {
      await addToCart(product._id, 1)
    } catch (error) {
      console.error(error)
    }
  }

  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'd'
  }

  if (loading) return <Loading />

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#F5F5F3] rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-[20px] font-semibold text-[#2D2D2D] mb-2">Vui lòng đăng nhập</h2>
          <p className="text-[#6B6B6B] mb-6">Đăng nhập để xem danh sách yêu thích của bạn</p>
          <Link
            to="/dang-nhap"
            className="inline-block px-6 py-3 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-2">Sản phẩm yêu thích</h1>
      <p className="text-[#6B6B6B] mb-8">{wishlist.length} sản phẩm</p>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl overflow-hidden border border-[#EBEBEB] group">
              <Link to={`/san-pham/${product.slug}`}>
                <div className="relative aspect-[4/5] bg-[#F5F5F3] overflow-hidden">
                  <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.salePrice && (
                    <span className="absolute top-3 right-3 bg-[#C45C4A] text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                      -{Math.round((1 - product.salePrice / product.price) * 100)}%
                    </span>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/san-pham/${product.slug}`}>
                  <h3 className="text-[14px] font-medium text-[#2D2D2D] line-clamp-2 min-h-[42px] leading-[1.5] group-hover:text-[#7C9A82] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-2 flex items-baseline gap-2">
                  {product.salePrice ? (
                    <>
                      <span className="text-[#C45C4A] text-[16px] font-semibold">{formatPrice(product.salePrice)}</span>
                      <span className="text-[#9A9A9A] text-[13px] line-through">{formatPrice(product.price)}</span>
                    </>
                  ) : (
                    <span className="text-[#2D2D2D] text-[16px] font-semibold">{formatPrice(product.price)}</span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 py-2.5 bg-[#7C9A82] text-white text-[13px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
                  >
                    {product.hasVariants ? 'Chọn phiên bản' : 'Thêm vào giỏ'}
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="p-2.5 text-[#6B6B6B] hover:text-[#C45C4A] hover:bg-[#FEF2F2] rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#F5F5F3] rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-[20px] font-semibold text-[#2D2D2D] mb-2">Chưa có sản phẩm yêu thích</h2>
          <p className="text-[#6B6B6B] mb-6">Hãy thêm sản phẩm vào danh sách yêu thích để theo dõi</p>
          <Link
            to="/san-pham"
            className="inline-block px-6 py-3 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      )}
    </div>
  )
}

export default Wishlist
