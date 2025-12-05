import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const AdminReports = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('daily')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports')
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
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + ' tỷ'
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + ' tr'
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'k'
    }
    return value
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
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

  const chartData = activeTab === 'daily' ? data?.dailyStats : data?.monthlyStats
  const maxRevenue = Math.max(...(chartData?.map(d => d.revenue) || [0]), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-semibold text-[#2D2D2D]">Báo cáo</h1>
        <p className="text-[14px] text-[#6B6B6B] mt-1">Thống kê doanh thu và hoạt động kinh doanh</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[12px] text-[#6B6B6B]">Tổng</span>
          </div>
          <p className="text-[22px] font-semibold text-[#2D2D2D]">
            {formatCurrency(data?.revenue?.total)}
          </p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Tổng doanh thu</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#FFF8E1] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#F9A825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-[12px] text-[#6B6B6B]">Tháng này</span>
          </div>
          <p className="text-[22px] font-semibold text-[#2D2D2D]">
            {formatCurrency(data?.revenue?.thisMonth)}
          </p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Doanh thu tháng</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-[#1976D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-[12px] text-[#6B6B6B]">Tổng</span>
          </div>
          <p className="text-[22px] font-semibold text-[#2D2D2D]">
            {data?.orders?.total || 0}
          </p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Tổng đơn hàng</p>
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
          <p className="text-[22px] font-semibold text-[#2D2D2D]">
            {data?.users?.total || 0}
          </p>
          <p className="text-[13px] text-[#6B6B6B] mt-1">Khách hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[16px] font-semibold text-[#2D2D2D]">Biểu đồ doanh thu</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                activeTab === 'daily'
                  ? 'bg-[#7C9A82] text-white'
                  : 'bg-[#F5F5F3] text-[#6B6B6B] hover:bg-[#EBEBEB]'
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                activeTab === 'monthly'
                  ? 'bg-[#7C9A82] text-white'
                  : 'bg-[#F5F5F3] text-[#6B6B6B] hover:bg-[#EBEBEB]'
              }`}
            >
              6 tháng qua
            </button>
          </div>
        </div>

        <div className="h-64 flex items-end gap-2">
          {chartData?.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center">
                <span className="text-[11px] text-[#6B6B6B] mb-1">
                  {formatShortCurrency(item.revenue)}
                </span>
                <div
                  className="w-full bg-[#7C9A82] rounded-t-lg transition-all duration-300 hover:bg-[#6B8A71]"
                  style={{
                    height: `${Math.max((item.revenue / maxRevenue) * 180, 4)}px`
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-[11px] text-[#2D2D2D] font-medium">
                  {activeTab === 'daily' ? formatDate(item.date) : item.month}
                </p>
                <p className="text-[10px] text-[#9A9A9A]">{item.orders} đơn</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-semibold text-[#2D2D2D]">Sản phẩm bán chạy</h2>
            <Link to="/admin/san-pham" className="text-[13px] text-[#7C9A82] hover:text-[#6B8A71] font-medium">
              Xem tất cả
            </Link>
          </div>
          {data?.topProducts?.length > 0 ? (
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
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-[#F5F5F3]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#2D2D2D] truncate">{product.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[12px] text-[#7C9A82]">Đã bán: {product.soldCount || 0}</span>
                      <span className="text-[12px] text-[#9A9A9A]">Kho: {product.stock}</span>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-[#2D2D2D]">
                    {formatCurrency(product.salePrice || product.price)}
                  </p>
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
          <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Thống kê theo danh mục</h2>
          {data?.categoryStats?.length > 0 ? (
            <div className="space-y-4">
              {data.categoryStats.map((cat, index) => (
                <div key={cat._id || index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-medium text-[#2D2D2D]">
                      {cat.name || 'Chưa phân loại'}
                    </span>
                    <span className="text-[13px] text-[#7C9A82] font-medium">
                      {formatCurrency(cat.revenue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-[#F5F5F3] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7C9A82] rounded-full"
                        style={{
                          width: `${Math.min(100, (cat.revenue / Math.max(...data.categoryStats.map(c => c.revenue))) * 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-[12px] text-[#6B6B6B] w-20 text-right">
                      {cat.totalSold} sản phẩm
                    </span>
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
          <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Thống kê đơn hàng</h2>
          {data?.ordersByStatus?.length > 0 ? (
            <div className="space-y-4">
              {data.ordersByStatus.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 bg-[#F9F9F9] rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-lg text-[12px] font-medium ${getStatusColor(item._id)}`}>
                      {getStatusText(item._id)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-2 bg-[#EBEBEB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7C9A82] rounded-full"
                        style={{ width: `${Math.min(100, (item.count / data.orders.total) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[14px] font-semibold text-[#2D2D2D] w-12 text-right">
                      {item.count}
                    </span>
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
            <span className="px-2.5 py-1 bg-[#FEF2F2] text-[#C45C4A] text-[12px] font-medium rounded-lg">
              {data?.lowStock?.length || 0} sản phẩm
            </span>
          </div>
          {data?.lowStock?.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {data.lowStock.map((product) => (
                <div key={product._id} className="flex items-center gap-3 p-3 bg-[#FEF2F2] rounded-xl">
                  <img
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-[#F5F5F3]"
                  />
                  <p className="text-[14px] text-[#2D2D2D] truncate flex-1">{product.name}</p>
                  <span className="px-2.5 py-1 bg-[#C45C4A] text-white text-[12px] font-medium rounded-lg">
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
    </div>
  )
}

export default AdminReports
