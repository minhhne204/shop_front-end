import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProductCard = ({ product }) => {
  const { _id, name, slug, price, salePrice, images, status } = product
  const { user, isInWishlist, addToWishlist, removeFromWishlist } = useAuth()
  const navigate = useNavigate()

  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'd'
  }

  const getStatusLabel = () => {
    switch (status) {
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

  const statusLabel = getStatusLabel()
  const inWishlist = isInWishlist(_id)

  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate('/dang-nhap')
      return
    }
    if (inWishlist) {
      removeFromWishlist(_id)
    } else {
      addToWishlist(_id)
    }
  }

  return (
    <Link to={`/san-pham/${slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden hover-lift border border-[#EBEBEB]">
        <div className="relative aspect-[4/5] bg-[#F5F5F3] overflow-hidden">
          <img
            src={images?.[0] || '/placeholder.jpg'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {statusLabel && (
              <span className={`${statusLabel.bg} text-white text-[11px] font-medium px-2.5 py-1 rounded-full`}>
                {statusLabel.text}
              </span>
            )}
          </div>
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              inWishlist
                ? 'bg-[#C45C4A] text-white'
                : 'bg-white/90 text-[#6B6B6B] hover:bg-white hover:text-[#C45C4A]'
            }`}
          >
            <svg className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          {salePrice && (
            <span className="absolute bottom-3 right-3 bg-[#C45C4A] text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
              -{Math.round((1 - salePrice / price) * 100)}%
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4">
          <h3 className="text-[14px] font-medium text-[#2D2D2D] line-clamp-2 min-h-[42px] leading-[1.5] group-hover:text-[#7C9A82] transition-colors duration-200">
            {name}
          </h3>
          <div className="mt-3 flex items-baseline gap-2">
            {salePrice ? (
              <>
                <span className="text-[#C45C4A] text-[16px] font-semibold">{formatPrice(salePrice)}</span>
                <span className="text-[#9A9A9A] text-[13px] line-through">{formatPrice(price)}</span>
              </>
            ) : (
              <span className="text-[#2D2D2D] text-[16px] font-semibold">{formatPrice(price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
