import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Loading from '../components/Loading'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders')
        setOrders(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'd'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN')
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

  if (loading) return <Loading />

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-8">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#EBEBEB]">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-[#6B6B6B] mb-4">Bạn chưa có đơn hàng nào</p>
          <Link to="/san-pham" className="text-[14px] text-[#7C9A82] hover:text-[#6B8A71] font-medium transition-colors">
            Bắt đầu mua sắm
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusLabel = getStatusLabel(order.status)
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-[#6B6B6B]">Mã đơn:</span>
                    <span className="text-[14px] font-medium text-[#2D2D2D]">{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${statusLabel.bg} ${statusLabel.color}`}>
                    {statusLabel.text}
                  </span>
                </div>

                <div className="border-t border-b border-[#EBEBEB] py-4 space-y-3">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-16 h-16 flex-shrink-0 bg-[#F5F5F3] rounded-lg overflow-hidden">
                        <img
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] text-[#2D2D2D] line-clamp-1">{item.name}</p>
                        {item.variantName && (
                          <p className="text-[12px] text-[#7C9A82] mt-0.5">Phiên bản: {item.variantName}</p>
                        )}
                        <p className="text-[13px] text-[#9A9A9A] mt-1">x{item.quantity}</p>
                      </div>
                      <span className="text-[14px] font-medium text-[#2D2D2D]">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-[13px] text-[#6B6B6B]">
                      và {order.items.length - 2} sản phẩm khác
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-[13px] text-[#9A9A9A]">{formatDate(order.createdAt)}</span>
                  <div className="flex items-center gap-5">
                    <span className="text-[16px] font-semibold text-[#C45C4A]">{formatPrice(order.totalAmount)}</span>
                    <Link
                      to={`/don-hang/${order._id}`}
                      className="text-[14px] text-[#7C9A82] hover:text-[#6B8A71] font-medium transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Orders
