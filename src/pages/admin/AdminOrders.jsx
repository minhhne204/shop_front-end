import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sort: '-createdAt'
  })
  const [updateModal, setUpdateModal] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  const fetchOrders = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      if (filters.status) params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)
      if (filters.sort) params.append('sort', filters.sort)

      const res = await api.get(`/admin/orders?${params.toString()}`)
      setOrders(res.data.orders || [])
      setPagination({
        page: res.data.page || 1,
        pages: res.data.pages || 1,
        total: res.data.total || 0
      })
    } catch (error) {
      console.error(error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(1)
  }, [filters])

  const handleUpdateStatus = async () => {
    if (!updateModal || !newStatus) return
    try {
      await api.put(`/admin/orders/${updateModal._id}/status`, { status: newStatus })
      setUpdateModal(null)
      setNewStatus('')
      fetchOrders(pagination.page)
    } catch (error) {
      console.error(error)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const statuses = [
    { value: '', label: 'Tất cả', count: pagination.total },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã huỷ' }
  ]

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipping: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    const texts = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã huỷ'
    }
    return (
      <span className={`px-2.5 py-1 rounded-lg text-[12px] font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {texts[status] || status}
      </span>
    )
  }

  const renderPagination = () => {
    if (pagination.pages <= 1) return null

    const pages = []
    const maxVisible = 5
    let start = Math.max(1, pagination.page - Math.floor(maxVisible / 2))
    let end = Math.min(pagination.pages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center gap-2 p-5 border-t border-[#EBEBEB]">
        <button
          onClick={() => fetchOrders(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="w-9 h-9 rounded-lg border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => fetchOrders(1)}
              className="w-9 h-9 rounded-lg text-[14px] font-medium border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82] transition-colors"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-[#9A9A9A]">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => fetchOrders(page)}
            className={`w-9 h-9 rounded-lg text-[14px] font-medium transition-colors ${
              page === pagination.page
                ? 'bg-[#7C9A82] text-white'
                : 'border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82]'
            }`}
          >
            {page}
          </button>
        ))}

        {end < pagination.pages && (
          <>
            {end < pagination.pages - 1 && <span className="px-1 text-[#9A9A9A]">...</span>}
            <button
              onClick={() => fetchOrders(pagination.pages)}
              className="w-9 h-9 rounded-lg text-[14px] font-medium border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82] transition-colors"
            >
              {pagination.pages}
            </button>
          </>
        )}

        <button
          onClick={() => fetchOrders(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
          className="w-9 h-9 rounded-lg border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-semibold text-[#2D2D2D]">Đơn hàng</h1>
        <p className="text-[14px] text-[#6B6B6B] mt-1">{pagination.total} đơn hàng</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB]">
        <div className="p-5 border-b border-[#EBEBEB]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Tìm mã đơn, tên khách..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F3] border-0 rounded-xl text-[14px] placeholder-[#9A9A9A] focus:ring-2 focus:ring-[#7C9A82] transition-all"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="px-4 py-2.5 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
            >
              <option value="-createdAt">Mới nhất</option>
              <option value="createdAt">Cũ nhất</option>
              <option value="-total">Giá trị cao</option>
              <option value="total">Giá trị thấp</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilters({ ...filters, status: status.value })}
                className={`px-4 py-2 rounded-xl text-[14px] font-medium transition-colors ${
                  filters.status === status.value
                    ? 'bg-[#7C9A82] text-white'
                    : 'bg-[#F5F5F3] text-[#6B6B6B] hover:bg-[#EBEBEB]'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EBEBEB]">
                    <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Mã đơn</th>
                    <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Khách hàng</th>
                    <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Sản phẩm</th>
                    <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Tổng tiền</th>
                    <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Trạng thái</th>
                    <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Ngày đặt</th>
                    <th className="text-right px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-[#EBEBEB] last:border-0 hover:bg-[#FAFAF8]">
                      <td className="px-5 py-4">
                        <p className="text-[14px] font-medium text-[#7C9A82]">#{order._id.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[14px] font-medium text-[#2D2D2D]">{order.shippingAddress?.fullName}</p>
                        <p className="text-[12px] text-[#6B6B6B] mt-0.5">{order.shippingAddress?.phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <img
                              key={i}
                              src={item.product?.images?.[0] || '/placeholder.png'}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover bg-[#F5F5F3] -ml-2 first:ml-0 border-2 border-white"
                            />
                          ))}
                          {(order.items?.length || 0) > 3 && (
                            <span className="ml-2 text-[12px] text-[#6B6B6B]">+{order.items.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[14px] font-medium text-[#2D2D2D]">{formatCurrency(order.totalAmount)}</p>
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[14px] text-[#6B6B6B]">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/don-hang/${order._id}`}
                            className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] hover:bg-[#F5F5F3] rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <button
                              onClick={() => { setUpdateModal(order); setNewStatus(order.status) }}
                              className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] hover:bg-[#F5F5F3] rounded-lg transition-colors"
                              title="Cập nhật trạng thái"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-[#6B6B6B]">Không tìm thấy đơn hàng nào</p>
          </div>
        )}
      </div>

      {updateModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setUpdateModal(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-4">Cập nhật trạng thái</h3>
            <div className="space-y-3 mb-6">
              {statuses.filter(s => s.value).map((status) => (
                <label
                  key={status.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    newStatus === status.value
                      ? 'border-[#7C9A82] bg-[#F5FAF6]'
                      : 'border-[#EBEBEB] hover:border-[#7C9A82]'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={newStatus === status.value}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-4 h-4 text-[#7C9A82] focus:ring-[#7C9A82]"
                  />
                  <span className="text-[14px] text-[#2D2D2D]">{status.label}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUpdateModal(null)}
                className="px-5 py-2.5 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminOrders
