import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const StarRating = ({ rating, onRate, interactive = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0)
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5'

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          disabled={!interactive}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <svg
            className={`${sizeClass} ${
              star <= (hovered || rating)
                ? 'text-[#F5A623]'
                : 'text-[#E0E0E0]'
            } transition-colors`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

const ProductReviews = ({ slug }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [error, setError] = useState('')
  const [userReview, setUserReview] = useState(null)
  const [canUserReview, setCanUserReview] = useState({ canReview: false, hasPurchased: false, hasReviewed: false })

  const fetchReviews = async (page = 1) => {
    try {
      const res = await api.get(`/products/${slug}/reviews?page=${page}&limit=5`)
      setReviews(res.data.reviews)
      setStats(res.data.stats)
      setPagination({
        page: res.data.page,
        totalPages: res.data.totalPages,
        total: res.data.total
      })

      if (user) {
        const myReview = res.data.reviews.find(r => r.user._id === user._id)
        if (myReview) setUserReview(myReview)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const checkCanReview = async () => {
    if (!user) return
    try {
      const res = await api.get(`/products/${slug}/can-review`)
      setCanUserReview(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [slug])

  useEffect(() => {
    if (user) {
      checkCanReview()
    }
  }, [user, slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/dang-nhap')
      return
    }

    if (!form.comment.trim()) {
      setError('Vui lòng nhập nội dung đánh giá')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await api.post(`/products/${slug}/reviews`, form)
      setForm({ rating: 5, comment: '' })
      setShowForm(false)
      fetchReviews()
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getRatingPercent = (count) => {
    if (!stats?.totalReviews) return 0
    return Math.round((count / stats.totalReviews) * 100)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8">
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-semibold text-[#2D2D2D]">Đánh giá sản phẩm</h2>
        {user && canUserReview.canReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
          >
            Viết đánh giá
          </button>
        )}
        {user && !canUserReview.hasPurchased && !canUserReview.hasReviewed && (
          <span className="text-[13px] text-[#9A9A9A] bg-[#F5F5F3] px-3 py-2 rounded-lg">
            Mua sản phẩm để đánh giá
          </span>
        )}
      </div>

      {stats && stats.totalReviews > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-[#EBEBEB]">
          <div className="text-center">
            <div className="text-[48px] font-semibold text-[#2D2D2D] leading-none mb-2">
              {stats.avgRating.toFixed(1)}
            </div>
            <StarRating rating={Math.round(stats.avgRating)} size="lg" />
            <p className="text-[14px] text-[#6B6B6B] mt-2">{stats.totalReviews} đánh giá</p>
          </div>

          <div className="md:col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-[14px] text-[#6B6B6B] w-8">{star}</span>
                <svg className="w-4 h-4 text-[#F5A623]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 h-2 bg-[#F5F5F3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F5A623] rounded-full transition-all duration-300"
                    style={{ width: `${getRatingPercent(stats[`rating${star}`])}%` }}
                  />
                </div>
                <span className="text-[14px] text-[#6B6B6B] w-12 text-right">
                  {stats[`rating${star}`]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : !showForm && (
        <div className="text-center py-10 border-b border-[#EBEBEB] mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <p className="text-[#6B6B6B] mb-2">Chưa có đánh giá nào</p>
          <p className="text-[14px] text-[#9A9A9A]">Hãy là người đầu tiên đánh giá sản phẩm này</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 pb-8 border-b border-[#EBEBEB]">
          <h3 className="text-[16px] font-semibold text-[#2D2D2D] mb-4">Viết đánh giá của bạn</h3>

          <div className="mb-4">
            <label className="block text-[14px] text-[#6B6B6B] mb-2">Đánh giá</label>
            <StarRating
              rating={form.rating}
              onRate={(rating) => setForm({ ...form, rating })}
              interactive
              size="lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[14px] text-[#6B6B6B] mb-2">Nội dung</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all resize-none"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            />
          </div>

          {error && (
            <p className="text-[14px] text-[#C45C4A] mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setError('')
                setForm({ rating: 5, comment: '' })
              }}
              className="px-5 py-2.5 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      )}

      {reviews.length > 0 && (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="pb-6 border-b border-[#EBEBEB] last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-medium text-[#2D2D2D]">{review.user.fullName}</p>
                    {review.isVerifiedPurchase && (
                      <span className="flex items-center gap-1 text-[11px] text-[#7C9A82] bg-[#F0F5F1] px-2 py-0.5 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Đã mua hàng
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#9A9A9A]">{formatDate(review.createdAt)}</p>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="text-[14px] text-[#6B6B6B] leading-relaxed">{review.comment}</p>
            </div>
          ))}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => fetchReviews(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-[14px] text-[#6B6B6B]">
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchReviews(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-lg border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {!user && reviews.length === 0 && !showForm && (
        <div className="text-center">
          <button
            onClick={() => navigate('/dang-nhap')}
            className="text-[14px] text-[#7C9A82] hover:text-[#6B8A71] font-medium transition-colors"
          >
            Đăng nhập để đánh giá sản phẩm
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductReviews
