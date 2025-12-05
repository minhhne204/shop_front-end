import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'

const PreOrder = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [preOrders, setPreOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [registering, setRegistering] = useState(null)
  const [modal, setModal] = useState({ open: false, preOrder: null })
  const [form, setForm] = useState({ quantity: 1, note: '' })
  const [myRegistrations, setMyRegistrations] = useState([])

  const fetchPreOrders = async (page = 1) => {
    setLoading(true)
    try {
      const res = await api.get(`/preorders?page=${page}&limit=12`)
      setPreOrders(res.data.preOrders || [])
      setPagination({
        page: res.data.page,
        totalPages: res.data.totalPages,
        total: res.data.total
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyRegistrations = async () => {
    if (!user) return
    try {
      const res = await api.get('/preorders/my-registrations')
      setMyRegistrations(res.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchPreOrders()
    fetchMyRegistrations()
  }, [user])

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

  const isRegistered = (preOrderId) => {
    return myRegistrations.some(r => r.preOrder?._id === preOrderId && r.status !== 'cancelled')
  }

  const openRegisterModal = (preOrder) => {
    if (!user) {
      navigate('/dang-nhap')
      return
    }
    setForm({ quantity: 1, note: '' })
    setModal({ open: true, preOrder })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!modal.preOrder) return

    setRegistering(modal.preOrder._id)
    try {
      await api.post('/preorders/register', {
        preOrderId: modal.preOrder._id,
        quantity: form.quantity,
        note: form.note
      })
      setModal({ open: false, preOrder: null })
      fetchPreOrders(pagination.page)
      fetchMyRegistrations()
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setRegistering(null)
    }
  }

  const getRemainingSlots = (preOrder) => {
    return preOrder.quantity - (preOrder.currentOrders || 0)
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-2">Đặt trước sản phẩm</h1>
        <p className="text-[15px] text-[#6B6B6B]">Đăng ký nhận thông báo và đặt trước những sản phẩm sắp ra mắt</p>
      </div>

      {preOrders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preOrders.map((preOrder) => {
              const product = preOrder.product
              const remaining = getRemainingSlots(preOrder)
              const registered = isRegistered(preOrder._id)

              return (
                <div key={preOrder._id} className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden group">
                  <Link to={`/san-pham/${product?.slug}`}>
                    <div className="relative aspect-[4/5] bg-[#F5F5F3] overflow-hidden">
                      <img
                        src={product?.images?.[0] || '/placeholder.jpg'}
                        alt={product?.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="bg-[#B4956B] text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                          Pre-Order
                        </span>
                      </div>
                      {product?.salePrice && (
                        <span className="absolute top-3 right-3 bg-[#C45C4A] text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                          -{Math.round((1 - product.salePrice / product.price) * 100)}%
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link to={`/san-pham/${product?.slug}`}>
                      <h3 className="text-[15px] font-medium text-[#2D2D2D] line-clamp-2 min-h-[45px] leading-[1.5] group-hover:text-[#7C9A82] transition-colors mb-3">
                        {product?.name}
                      </h3>
                    </Link>

                    <div className="flex items-baseline gap-2 mb-4">
                      {product?.salePrice ? (
                        <>
                          <span className="text-[#C45C4A] text-[18px] font-semibold">{formatPrice(product.salePrice)}</span>
                          <span className="text-[#9A9A9A] text-[14px] line-through">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className="text-[#2D2D2D] text-[18px] font-semibold">{formatPrice(product?.price)}</span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4 text-[13px]">
                      <div className="flex justify-between">
                        <span className="text-[#6B6B6B]">Dự kiến về hàng:</span>
                        <span className="text-[#2D2D2D] font-medium">{formatDate(preOrder.expectedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B6B6B]">Còn lại:</span>
                        <span className={`font-medium ${remaining > 0 ? 'text-[#7C9A82]' : 'text-[#C45C4A]'}`}>
                          {remaining > 0 ? `${remaining}/${preOrder.quantity} suất` : 'Hết suất'}
                        </span>
                      </div>
                    </div>

                    <div className="h-1.5 bg-[#F5F5F3] rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-[#7C9A82] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((preOrder.currentOrders / preOrder.quantity) * 100, 100)}%` }}
                      />
                    </div>

                    {registered ? (
                      <div className="flex items-center justify-center gap-2 py-3 bg-[#F0F5F1] text-[#7C9A82] rounded-xl text-[14px] font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Đã đăng ký
                      </div>
                    ) : remaining > 0 ? (
                      <button
                        onClick={() => openRegisterModal(preOrder)}
                        className="w-full py-3 bg-[#B4956B] text-white rounded-xl text-[14px] font-medium hover:bg-[#a3865f] transition-colors"
                      >
                        Đăng ký đặt trước
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 bg-[#E5E5E5] text-[#9A9A9A] rounded-xl text-[14px] font-medium cursor-not-allowed"
                      >
                        Hết suất đăng ký
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => fetchPreOrders(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="w-10 h-10 rounded-xl border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchPreOrders(page)}
                  className={`w-10 h-10 rounded-xl text-[14px] font-medium transition-all ${
                    page === pagination.page
                      ? 'bg-[#7C9A82] text-white'
                      : 'border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => fetchPreOrders(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="w-10 h-10 rounded-xl border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#EBEBEB]">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-[#6B6B6B] mb-2">Chưa có đợt pre-order nào</p>
          <p className="text-[14px] text-[#9A9A9A]">Hãy quay lại sau để xem các sản phẩm sắp ra mắt</p>
        </div>
      )}

      {modal.open && modal.preOrder && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setModal({ open: false, preOrder: null })} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-2">Đăng ký Pre-Order</h3>
            <p className="text-[14px] text-[#6B6B6B] mb-5">{modal.preOrder.product?.name}</p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Số lượng</label>
                <input
                  type="number"
                  min="1"
                  max={getRemainingSlots(modal.preOrder)}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                />
                <p className="text-[12px] text-[#9A9A9A] mt-1">Còn {getRemainingSlots(modal.preOrder)} suất</p>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Ghi chú (tùy chọn)</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all resize-none"
                  placeholder="Nhập ghi chú nếu có..."
                />
              </div>

              <div className="bg-[#FEF9F3] rounded-xl p-4 text-[13px] text-[#B4956B]">
                <p className="font-medium mb-1">Lưu ý:</p>
                <ul className="list-disc list-inside space-y-1 text-[12px]">
                  <li>Đăng ký pre-order không yêu cầu thanh toán ngay</li>
                  <li>Chúng tôi sẽ liên hệ khi hàng về</li>
                  <li>Dự kiến về hàng: {formatDate(modal.preOrder.expectedDate)}</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, preOrder: null })}
                  className="px-5 py-2.5 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={registering === modal.preOrder._id}
                  className="px-5 py-2.5 bg-[#B4956B] text-white text-[14px] font-medium rounded-xl hover:bg-[#a3865f] disabled:opacity-50 transition-colors"
                >
                  {registering === modal.preOrder._id ? 'Đang xử lý...' : 'Xác nhận đăng ký'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default PreOrder
