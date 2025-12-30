import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import api from '../services/api'
import Loading from '../components/Loading'

const OrderDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`)
        setOrder(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'd'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN')
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: { text: 'Chờ xử lý', bg: 'bg-[#FEF9E7]', color: 'text-[#B4956B]' },
      confirmed: { text: 'Đã xác nhận', bg: 'bg-[#E8F4FD]', color: 'text-[#6B8A9A]' },
      shipping: { text: 'Đang giao', bg: 'bg-[#F3E8FD]', color: 'text-[#8A6B9A]' },
      delivered: { text: 'Đã giao', bg: 'bg-[#F0F5F1]', color: 'text-[#7C9A82]' },
      cancelled: { text: 'Đã hủy', bg: 'bg-[#FEF2F2]', color: 'text-[#C45C4A]' },
      returned: { text: 'Đổi trả', bg: 'bg-[#F5F5F3]', color: 'text-[#6B6B6B]' }
    }
    return labels[status] || { text: status, bg: 'bg-[#F5F5F3]', color: 'text-[#6B6B6B]' }
  }

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy đơn hàng')
      return
    }
    setCancelling(true)
    try {
      const res = await api.put(`/orders/${id}/cancel`, { cancelReason: cancelReason.trim() })
      setOrder(res.data)
      setShowCancelModal(false)
      setCancelReason('')
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể hủy đơn hàng')
    } finally {
      setCancelling(false)
    }
  }

  const getPaymentMethodText = (method) => {
    const methods = {
      cod: 'Thanh toán khi nhận hàng (COD)',
      banking: 'Chuyển khoản ngân hàng',
      vnpay: 'Thanh toán VNPay'
    }
    return methods[method] || method
  }

  const getPaymentStatusText = (status) => {
    const statuses = {
      pending: { text: 'Chờ thanh toán', color: 'text-[#B4956B]' },
      paid: { text: 'Đã thanh toán', color: 'text-[#7C9A82]' },
      failed: { text: 'Thanh toán thất bại', color: 'text-[#C45C4A]' }
    }
    return statuses[status] || { text: status, color: 'text-[#6B6B6B]' }
  }

  if (loading) return <Loading />
  if (!order) return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-[#6B6B6B]">Không tìm thấy đơn hàng</p>
    </div>
  )

  const statusLabel = getStatusLabel(order.status)
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      {location.state?.success && (
        <div className="bg-[#F0F5F1] text-[#7C9A82] text-[14px] px-5 py-4 rounded-xl mb-6 text-center">
          Đặt hàng thành công! Cảm ơn bạn đã mua hàng.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[20px] font-semibold text-[#2D2D2D]">Chi tiết đơn hàng</h1>
          <span className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${statusLabel.bg} ${statusLabel.color}`}>
            {statusLabel.text}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[14px]">
          <div>
            <span className="text-[#6B6B6B]">Mã đơn hàng:</span>
            <p className="font-medium text-[#2D2D2D] mt-1">{order._id}</p>
          </div>
          <div>
            <span className="text-[#6B6B6B]">Ngày đặt:</span>
            <p className="font-medium text-[#2D2D2D] mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <span className="text-[#6B6B6B]">Phương thức thanh toán:</span>
            <p className="font-medium text-[#2D2D2D] mt-1">
              {getPaymentMethodText(order.paymentMethod)}
            </p>
          </div>
          {order.paymentMethod === 'vnpay' && (
            <div>
              <span className="text-[#6B6B6B]">Trạng thái thanh toán:</span>
              <p className={`font-medium mt-1 ${getPaymentStatusText(order.paymentStatus).color}`}>
                {getPaymentStatusText(order.paymentStatus).text}
              </p>
            </div>
          )}
          {order.promoCode && (
            <div>
              <span className="text-[#6B6B6B]">Mã giảm giá:</span>
              <p className="font-medium text-[#7C9A82] mt-1">{order.promoCode}</p>
            </div>
          )}
        </div>
        {order.status === 'cancelled' && order.cancelReason && (
          <div className="mt-5 pt-5 border-t border-[#EBEBEB]">
            <span className="text-[13px] text-[#6B6B6B]">Lý do hủy:</span>
            <p className="text-[14px] text-[#C45C4A] mt-1">{order.cancelReason}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 mb-6">
        <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-4">Địa chỉ giao hàng</h2>
        <div className="text-[14px]">
          <p className="font-medium text-[#2D2D2D]">{order.shippingAddress.fullName}</p>
          <p className="text-[#6B6B6B] mt-1">{order.shippingAddress.phone}</p>
          <p className="text-[#6B6B6B] mt-1">
            {order.shippingAddress.street}, {order.shippingAddress.ward},{' '}
            {order.shippingAddress.district}, {order.shippingAddress.city}
          </p>
        </div>
        {order.note && (
          <div className="mt-4 pt-4 border-t border-[#EBEBEB]">
            <span className="text-[13px] text-[#6B6B6B]">Ghi chú:</span>
            <p className="text-[14px] text-[#2D2D2D] mt-1">{order.note}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 mb-6">
        <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Sản phẩm</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-20 h-20 flex-shrink-0 bg-[#F5F5F3] rounded-xl overflow-hidden">
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[#2D2D2D]">{item.name}</p>
                {item.variantName && (
                  <p className="text-[12px] text-[#7C9A82] mt-0.5">Phiên bản: {item.variantName}</p>
                )}
                <p className="text-[13px] text-[#6B6B6B] mt-1">
                  {formatPrice(item.price)} x {item.quantity}
                </p>
              </div>
              <span className="text-[14px] font-medium text-[#2D2D2D]">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#EBEBEB] mt-5 pt-5 space-y-3 text-[14px]">
          <div className="flex justify-between">
            <span className="text-[#6B6B6B]">Tạm tính</span>
            <span className="text-[#2D2D2D]">{formatPrice(subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#7C9A82]">
              <span>Giảm giá</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#6B6B6B]">Phí vận chuyển</span>
            <span className={order.shippingFee === 0 ? 'text-[#7C9A82]' : 'text-[#2D2D2D]'}>
              {order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-[#EBEBEB]">
            <span className="text-[16px] font-semibold text-[#2D2D2D]">Tổng cộng</span>
            <span className="text-[18px] font-semibold text-[#C45C4A]">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {order.status === 'pending' && (
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-full border-2 border-[#C45C4A] text-[#C45C4A] py-4 rounded-xl text-[15px] font-medium hover:bg-[#FEF2F2] transition-colors"
        >
          Hủy đơn hàng
        </button>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-4">Hủy đơn hàng</h3>
            <p className="text-[14px] text-[#6B6B6B] mb-4">Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này:</p>
            <div className="space-y-3 mb-4">
              {['Đổi ý, không muốn mua nữa', 'Muốn thay đổi sản phẩm', 'Tìm được giá rẻ hơn', 'Đặt nhầm sản phẩm'].map((reason) => (
                <label key={reason} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-4 h-4 text-[#C45C4A] focus:ring-[#C45C4A]"
                  />
                  <span className="text-[14px] text-[#2D2D2D]">{reason}</span>
                </label>
              ))}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="cancelReason"
                  value="other"
                  checked={!['Đổi ý, không muốn mua nữa', 'Muốn thay đổi sản phẩm', 'Tìm được giá rẻ hơn', 'Đặt nhầm sản phẩm'].includes(cancelReason) && cancelReason !== ''}
                  onChange={() => setCancelReason('')}
                  className="w-4 h-4 mt-0.5 text-[#C45C4A] focus:ring-[#C45C4A]"
                />
                <span className="text-[14px] text-[#2D2D2D]">Lý do khác</span>
              </label>
            </div>
            {!['Đổi ý, không muốn mua nữa', 'Muốn thay đổi sản phẩm', 'Tìm được giá rẻ hơn', 'Đặt nhầm sản phẩm'].includes(cancelReason) && (
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do của bạn..."
                rows={3}
                className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#C45C4A] transition-colors resize-none mb-4"
              />
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelReason('')
                }}
                className="flex-1 bg-[#F5F5F3] text-[#2D2D2D] py-3 rounded-xl text-[14px] font-medium hover:bg-[#EBEBEB] transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling || !cancelReason.trim()}
                className="flex-1 bg-[#C45C4A] text-white py-3 rounded-xl text-[14px] font-medium hover:bg-[#B04A3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetail
