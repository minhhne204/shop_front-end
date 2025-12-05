import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const UserStats = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/orders/stats')
      setData(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0) + 'đ'
  }

  const formatShortCurrency = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + ' tr'
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'k'
    }
    return value
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipping: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã huỷ'
    }
    return texts[status] || status
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const maxSpent = Math.max(...(data?.monthlyStats?.map(d => d.spent) || [0]), 1)

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-[#2D2D2D]">Thống kê mua hàng</h1>
          <p className="text-[14px] text-[#6B6B6B] mt-1">Theo dõi lịch sử và chi tiêu của bạn</p>
        </div>
        <Link
          to="/don-hang"
          className="px-4 py-2 bg-[#F5F5F3] rounded-xl text-[14px] font-medium text-[#2D2D2D] hover:bg-[#EBEBEB] transition-colors"
        >
          Xem đơn hàng
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[22px] font-semibold text-[#2D2D2D]">
            {formatCurrency(data?.totalSpent)}
          </p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Tổng chi tiêu</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#1976D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-[22px] font-semibold text-[#2D2D2D]">
            {data?.totalOrders || 0}
          </p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Tổng đơn hàng</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="w-12 h-12 bg-[#FFF3E0] rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[22px] font-semibold text-[#2D2D2D]">
            {data?.ordersByStatus?.find(s => s._id === 'delivered')?.count || 0}
          </p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Đơn hoàn thành</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 mb-6">
        <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-6">Chi tiêu 6 tháng gần đây</h2>
        <div className="h-48 flex items-end gap-3">
          {data?.monthlyStats?.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center">
                <span className="text-[11px] text-[#6B6B6B] mb-1">
                  {item.spent > 0 ? formatShortCurrency(item.spent) : '-'}
                </span>
                <div
                  className="w-full bg-[#7C9A82] rounded-t-lg transition-all duration-300"
                  style={{
                    height: `${Math.max((item.spent / maxSpent) * 140, item.spent > 0 ? 8 : 4)}px`,
                    opacity: item.spent > 0 ? 1 : 0.3
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-[11px] text-[#2D2D2D] font-medium">{item.month}</p>
                <p className="text-[10px] text-[#9A9A9A]">{item.orders} đơn</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-semibold text-[#2D2D2D]">Đơn hàng gần đây</h2>
            <Link to="/don-hang" className="text-[13px] text-[#7C9A82] hover:text-[#6B8A71] font-medium">
              Xem tất cả
            </Link>
          </div>
          {data?.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/don-hang/${order._id}`}
                  className="flex items-center justify-between p-3 bg-[#F9F9F9] rounded-xl hover:bg-[#F5F5F3] transition-colors"
                >
                  <div>
                    <p className="text-[14px] font-medium text-[#2D2D2D]">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-[12px] text-[#6B6B6B] mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-medium text-[#2D2D2D]">{formatCurrency(order.totalAmount)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium mt-1 ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#6B6B6B] text-[14px]">
              Chưa có đơn hàng nào
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Trạng thái đơn hàng</h2>
          {data?.ordersByStatus?.length > 0 ? (
            <div className="space-y-3">
              {data.ordersByStatus.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 bg-[#F9F9F9] rounded-xl">
                  <span className={`px-3 py-1.5 rounded-lg text-[12px] font-medium ${getStatusColor(item._id)}`}>
                    {getStatusText(item._id)}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-2 bg-[#EBEBEB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7C9A82] rounded-full"
                        style={{ width: `${Math.min(100, (item.count / data.totalOrders) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[14px] font-semibold text-[#2D2D2D] w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#6B6B6B] text-[14px]">
              Chưa có dữ liệu
            </div>
          )}
        </div>
      </div>

      {data?.topProducts?.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Sản phẩm đã mua nhiều nhất</h2>
          <div className="space-y-3">
            {data.topProducts.map((product, index) => (
              <div key={product._id} className="flex items-center gap-4 p-3 bg-[#F9F9F9] rounded-xl">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${
                  index === 0 ? 'bg-[#FFD700] text-white' :
                  index === 1 ? 'bg-[#C0C0C0] text-white' :
                  index === 2 ? 'bg-[#CD7F32] text-white' :
                  'bg-[#EBEBEB] text-[#6B6B6B]'
                }`}>
                  {index + 1}
                </span>
                <img
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-[#F5F5F3]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#2D2D2D] truncate">{product.name}</p>
                  <p className="text-[12px] text-[#6B6B6B]">Đã mua: {product.totalQuantity} sản phẩm</p>
                </div>
                <p className="text-[13px] font-medium text-[#7C9A82]">
                  {formatCurrency(product.totalSpent)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserStats
