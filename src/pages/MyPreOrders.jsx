import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'

const MyPreOrders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/dang-nhap')
      return
    }
    fetchRegistrations()
  }, [user])

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const res = await api.get('/preorders/my-registrations')
      setRegistrations(res.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelModal) return
    setCancelling(true)
    try {
      await api.delete(`/preorders/registration/${cancelModal._id}`)
      setCancelModal(null)
      fetchRegistrations()
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setCancelling(false)
    }
  }

  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-[12px] font-medium rounded-lg">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Đã xác nhận
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 text-[12px] font-medium rounded-lg">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Đã hủy
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-700 text-[12px] font-medium rounded-lg">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Chờ xử lý
          </span>
        )
    }
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-2">Đăng ký Pre-Order của tôi</h1>
        <p className="text-[15px] text-[#6B6B6B]">Theo dõi các sản phẩm bạn đã đăng ký đặt trước</p>
      </div>

      {registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const preOrder = reg.preOrder
            const product = preOrder?.product

            return (
              <div key={reg._id} className="bg-white rounded-2xl border border-[#EBEBEB] p-5 hover:border-[#7C9A82] transition-colors">
                <div className="flex gap-4">
                  <Link to={`/san-pham/${product?.slug}`}>
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F5F5F3] flex-shrink-0">
                      <img
                        src={product?.images?.[0] || '/placeholder.jpg'}
                        alt={product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link to={`/san-pham/${product?.slug}`}>
                          <h3 className="text-[15px] font-medium text-[#2D2D2D] hover:text-[#7C9A82] transition-colors line-clamp-1">
                            {product?.name || 'Sản phẩm không tồn tại'}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                          {product?.salePrice ? (
                            <>
                              <span className="text-[#C45C4A] text-[16px] font-semibold">{formatPrice(product.salePrice)}</span>
                              <span className="text-[#9A9A9A] text-[13px] line-through">{formatPrice(product.price)}</span>
                            </>
                          ) : (
                            <span className="text-[#2D2D2D] text-[16px] font-semibold">{formatPrice(product?.price || 0)}</span>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(reg.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-[13px]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#6B6B6B]">Số lượng:</span>
                        <span className="text-[#2D2D2D] font-medium">{reg.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#6B6B6B]">Ngày đăng ký:</span>
                        <span className="text-[#2D2D2D] font-medium">{formatDate(reg.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#6B6B6B]">Dự kiến về hàng:</span>
                        <span className="text-[#7C9A82] font-medium">{formatDate(preOrder?.expectedDate)}</span>
                      </div>
                    </div>

                    {reg.note && (
                      <div className="mt-3 text-[13px]">
                        <span className="text-[#6B6B6B]">Ghi chú: </span>
                        <span className="text-[#2D2D2D]">{reg.note}</span>
                      </div>
                    )}

                    {reg.status === 'pending' && (
                      <div className="mt-4">
                        <button
                          onClick={() => setCancelModal(reg)}
                          className="text-[13px] text-[#C45C4A] hover:text-[#a34a3c] font-medium transition-colors"
                        >
                          Hủy đăng ký
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#EBEBEB]">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-[#6B6B6B] mb-2">Bạn chưa đăng ký pre-order nào</p>
          <p className="text-[14px] text-[#9A9A9A] mb-6">Khám phá các sản phẩm sắp ra mắt</p>
          <Link
            to="/pre-order"
            className="inline-block px-6 py-3 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
          >
            Xem Pre-Order
          </Link>
        </div>
      )}

      {cancelModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setCancelModal(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-2">Hủy đăng ký Pre-Order</h3>
            <p className="text-[14px] text-[#6B6B6B] mb-6">
              Bạn có chắc muốn hủy đăng ký pre-order sản phẩm này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelModal(null)}
                disabled={cancelling}
                className="px-5 py-2.5 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors disabled:opacity-50"
              >
                Quay lại
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-5 py-2.5 bg-[#C45C4A] text-white text-[14px] font-medium rounded-xl hover:bg-[#a34a3c] disabled:opacity-50 transition-colors"
              >
                {cancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MyPreOrders
