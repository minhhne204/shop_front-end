import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import ProductReviews from '../components/ProductReviews'
import Loading from '../components/Loading'

const ProductDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [selectedVariant, setSelectedVariant] = useState(null)

  const { addToCart } = useCart()
  const { user, isInWishlist, addToWishlist, removeFromWishlist } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const [productRes, relatedRes] = await Promise.all([
          api.get(`/products/${slug}`),
          api.get(`/products/${slug}/related`)
        ])
        setProduct(productRes.data)
        setRelatedProducts(relatedRes.data)
        setSelectedImage(0)
        setQuantity(1)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'd'
  }

  const getStatusLabel = () => {
    switch (product?.status) {
      case 'available':
        return { text: 'Có sẵn', bg: 'bg-[#7C9A82]' }
      case 'order':
        return { text: 'Đặt hàng', bg: 'bg-[#6B8A9A]' }
      case 'preorder':
        return { text: 'Pre-Order', bg: 'bg-[#B4956B]' }
      default:
        return null
    }
  }

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.salePrice || selectedVariant.price || product.salePrice || product.price
    }
    return product.salePrice || product.price
  }

  const getOriginalPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price || product.price
    }
    return product.price
  }

  const getCurrentStock = () => {
    if (selectedVariant) {
      return selectedVariant.stock
    }
    return product.stock
  }

  const handleAddToCart = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Vui lòng đăng nhập để thêm vào giỏ hàng' })
      return
    }
    if (product.hasVariants && !selectedVariant) {
      setMessage({ type: 'error', text: 'Vui lòng chọn phiên bản sản phẩm' })
      return
    }
    try {
      await addToCart(
        product._id,
        quantity,
        selectedVariant?._id || null,
        selectedVariant?.name || null
      )
      setMessage({ type: 'success', text: 'Đã thêm vào giỏ hàng' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra' })
    }
  }

  const inWishlist = product ? isInWishlist(product._id) : false

  const handleWishlistClick = () => {
    if (!user) {
      navigate('/dang-nhap')
      return
    }
    if (inWishlist) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product._id)
    }
  }

  if (loading) return <Loading />
  if (!product) return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-[#6B6B6B]">Không tìm thấy sản phẩm</p>
    </div>
  )

  const statusLabel = getStatusLabel()

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <nav className="flex items-center gap-2 text-[14px] mb-8">
        <Link to="/" className="text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors">Trang chủ</Link>
        <svg className="w-4 h-4 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
        <Link to="/san-pham" className="text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors">Sản phẩm</Link>
        <svg className="w-4 h-4 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#2D2D2D] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <div className="aspect-square bg-[#F5F5F3] rounded-2xl overflow-hidden mb-4">
            <img
              src={product.images?.[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-[#7C9A82]' : 'border-transparent hover:border-[#EBEBEB]'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            {statusLabel && (
              <span className={`${statusLabel.bg} text-white text-[12px] font-medium px-3 py-1 rounded-full`}>
                {statusLabel.text}
              </span>
            )}
            {getCurrentStock() > 0 && (
              <span className="text-[13px] text-[#6B6B6B]">Còn {getCurrentStock()} sản phẩm</span>
            )}
          </div>

          <h1 className="text-[26px] font-semibold text-[#2D2D2D] leading-tight mb-5">{product.name}</h1>

          <div className="flex items-baseline gap-4 mb-6">
            {getCurrentPrice() < getOriginalPrice() ? (
              <>
                <span className="text-[28px] font-semibold text-[#C45C4A]">
                  {formatPrice(getCurrentPrice())}
                </span>
                <span className="text-[18px] text-[#9A9A9A] line-through">
                  {formatPrice(getOriginalPrice())}
                </span>
                <span className="bg-[#C45C4A] text-white text-[12px] font-medium px-2.5 py-1 rounded-full">
                  -{Math.round((1 - getCurrentPrice() / getOriginalPrice()) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-[28px] font-semibold text-[#2D2D2D]">
                {formatPrice(getCurrentPrice())}
              </span>
            )}
          </div>

          {product.hasVariants && product.variants?.length > 0 && (
            <div className="mb-6">
              <span className="text-[14px] text-[#6B6B6B] block mb-3">
                {product.variantType || 'Phiên bản'}: {selectedVariant ? <span className="text-[#2D2D2D] font-medium">{selectedVariant.name}</span> : <span className="text-[#C45C4A]">Chọn phiên bản</span>}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.filter(v => v.isActive).map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-xl text-[14px] border-2 transition-all ${
                      selectedVariant?._id === variant._id
                        ? 'border-[#7C9A82] bg-[#F0F5F1] text-[#7C9A82] font-medium'
                        : 'border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82]'
                    } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={variant.stock === 0}
                  >
                    {variant.name}
                    {variant.stock === 0 && ' (Hết hàng)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-[14px] text-[#6B6B6B]">Số lượng:</span>
            <div className="flex items-center border border-[#EBEBEB] rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center text-[#6B6B6B] hover:bg-[#F5F5F3] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 h-11 text-center text-[15px] font-medium text-[#2D2D2D] border-x border-[#EBEBEB]"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 flex items-center justify-center text-[#6B6B6B] hover:bg-[#F5F5F3] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#2D2D2D] text-white py-4 rounded-xl text-[15px] font-medium hover:bg-[#7C9A82] transition-colors duration-300"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleWishlistClick}
              className={`w-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
                inWishlist
                  ? 'bg-[#C45C4A] text-white'
                  : 'border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#C45C4A] hover:text-[#C45C4A]'
              }`}
              title={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            >
              <svg className="w-6 h-6" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {message.text && (
            <div className={`text-center py-3 px-4 rounded-xl text-[14px] ${
              message.type === 'error'
                ? 'bg-[#FEF2F2] text-[#C45C4A]'
                : 'bg-[#F0F5F1] text-[#7C9A82]'
            }`}>
              {message.text}
            </div>
          )}

          <div className="border-t border-[#EBEBEB] pt-6 mt-6 space-y-3">
            <div className="flex items-center gap-2 text-[14px]">
              <span className="text-[#6B6B6B]">Danh mục:</span>
              <Link to={`/san-pham?category=${product.category?._id}`} className="text-[#7C9A82] hover:text-[#6B8A71] font-medium transition-colors">
                {product.category?.name}
              </Link>
            </div>
            <div className="flex items-center gap-2 text-[14px]">
              <span className="text-[#6B6B6B]">Thương hiệu:</span>
              <Link to={`/san-pham?brand=${product.brand?._id}`} className="text-[#7C9A82] hover:text-[#6B8A71] font-medium transition-colors">
                {product.brand?.name}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-[#F5F5F3] rounded-xl">
              <svg className="w-6 h-6 mx-auto mb-2 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span className="text-[12px] text-[#6B6B6B]">Miễn phí ship</span>
            </div>
            <div className="text-center p-4 bg-[#F5F5F3] rounded-xl">
              <svg className="w-6 h-6 mx-auto mb-2 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-[12px] text-[#6B6B6B]">Chính hãng</span>
            </div>
            <div className="text-center p-4 bg-[#F5F5F3] rounded-xl">
              <svg className="w-6 h-6 mx-auto mb-2 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[12px] text-[#6B6B6B]">Đổi trả dễ</span>
            </div>
          </div>
        </div>
      </div>

      {product.description && (
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 mb-8">
          <h2 className="text-[20px] font-semibold text-[#2D2D2D] mb-5">Mô tả sản phẩm</h2>
          <div className="text-[15px] text-[#6B6B6B] leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>
      )}

      <div className="mb-16">
        <ProductReviews slug={slug} />
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-[22px] font-semibold text-[#2D2D2D] mb-8">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
