import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, ordersRes] = await Promise.all([
          api.get('/admin/reports'),
          api.get('/admin/orders?limit=5')
        ])
        setStats(reportsRes.data)
        setRecentOrders(ordersRes.data.orders || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
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
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-semibold text-[#2D2D2D]">Tổng quan</h1>
        <p className="text-[14px] text-[#6B6B6B] mt-1">Xin chào, chào mừng bạn quay trở lại</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[12px] text-[#6B6B6B]">Tháng này</span>
          </div>
          <p className="text-[24px] font-semibold text-[#2D2D2D]">
            {formatCurrency(stats?.revenue?.thisMonth || 0)}
          </p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Doanh thu</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#1976D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-[12px] text-[#6B6B6B]">Tháng này</span>
          </div>
          <p className="text-[24px] font-semibold text-[#2D2D2D]">
            {stats?.orders?.thisMonth || 0}
          </p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Đơn hàng</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#FFF3E0] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-[12px] text-[#6B6B6B]">Tổng</span>
          </div>
          <p className="text-[24px] font-semibold text-[#2D2D2D]">
            {stats?.products?.total || 0}
          </p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Sản phẩm</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#FCE4EC] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-[12px] text-[#6B6B6B]">Tổng</span>
          </div>
          <p className="text-[24px] font-semibold text-[#2D2D2D]">
            {stats?.users?.total || 0}
          </p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Khách hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-semibold text-[#2D2D2D]">Đơn hàng gần đây</h2>
            <Link to="/admin/don-hang" className="text-[13px] text-[#7C9A82] hover:text-[#6B8A71] font-medium">
              Xem tất cả
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-3 border-b border-[#EBEBEB] last:border-0">
                  <div>
                    <p className="text-[14px] font-medium text-[#2D2D2D]">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-[12px] text-[#6B6B6B] mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-medium text-[#2D2D2D]">{formatCurrency(order.totalAmount)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium mt-1 ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#6B6B6B] text-[14px]">
              Chưa có đơn hàng nào
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Sản phẩm bán chạy</h2>
          {stats?.topProducts?.length > 0 ? (
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center gap-4 py-3 border-b border-[#EBEBEB] last:border-0">
                  <span className="w-6 h-6 bg-[#F5F5F3] rounded-full flex items-center justify-center text-[12px] font-medium text-[#6B6B6B]">
                    {index + 1}
                  </span>
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-[#F5F5F3]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#2D2D2D] truncate">{product.name}</p>
                    <p className="text-[12px] text-[#6B6B6B]">Đã bán: {product.soldCount || 0}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-semibold text-[#2D2D2D]">Thống kê đơn hàng</h2>
          </div>
          {stats?.ordersByStatus?.length > 0 ? (
            <div className="space-y-3">
              {stats.ordersByStatus.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[12px] font-medium ${getStatusColor(item._id)}`}>
                      {getStatusText(item._id)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-[#F5F5F3] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7C9A82] rounded-full"
                        style={{ width: `${Math.min(100, (item.count / Math.max(...stats.ordersByStatus.map(s => s.count))) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[14px] font-medium text-[#2D2D2D] w-8 text-right">{item.count}</span>
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

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-semibold text-[#2D2D2D]">Sản phẩm sắp hết hàng</h2>
            <Link to="/admin/san-pham" className="text-[13px] text-[#7C9A82] hover:text-[#6B8A71] font-medium">
              Xem tất cả
            </Link>
          </div>
          {stats?.lowStock?.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStock.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-[#FEF2F2] rounded-xl">
                  <p className="text-[14px] text-[#2D2D2D] truncate flex-1">{product.name}</p>
                  <span className="ml-3 px-2.5 py-1 bg-[#C45C4A] text-white text-[12px] font-medium rounded-lg">
                    Còn {product.stock}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[14px] text-[#6B6B6B]">Tất cả sản phẩm đều đủ hàng</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/admin/san-pham/them"
          className="bg-white rounded-2xl border border-[#EBEBEB] p-5 hover:border-[#7C9A82] transition-colors group"
        >
          <div className="w-10 h-10 bg-[#F5F5F3] rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#E8F5E9] transition-colors">
            <svg className="w-5 h-5 text-[#6B6B6B] group-hover:text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-[#2D2D2D]">Thêm sản phẩm</p>
        </Link>

        <Link
          to="/admin/don-hang"
          className="bg-white rounded-2xl border border-[#EBEBEB] p-5 hover:border-[#7C9A82] transition-colors group"
        >
          <div className="w-10 h-10 bg-[#F5F5F3] rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#E8F5E9] transition-colors">
            <svg className="w-5 h-5 text-[#6B6B6B] group-hover:text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-[#2D2D2D]">Quản lý đơn</p>
        </Link>

        <Link
          to="/admin/tin-tuc/them"
          className="bg-white rounded-2xl border border-[#EBEBEB] p-5 hover:border-[#7C9A82] transition-colors group"
        >
          <div className="w-10 h-10 bg-[#F5F5F3] rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#E8F5E9] transition-colors">
            <svg className="w-5 h-5 text-[#6B6B6B] group-hover:text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-[#2D2D2D]">Viết bài mới</p>
        </Link>

        <Link
          to="/admin/khuyen-mai"
          className="bg-white rounded-2xl border border-[#EBEBEB] p-5 hover:border-[#7C9A82] transition-colors group"
        >
          <div className="w-10 h-10 bg-[#F5F5F3] rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#E8F5E9] transition-colors">
            <svg className="w-5 h-5 text-[#6B6B6B] group-hover:text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-[#2D2D2D]">Khuyến mãi</p>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
