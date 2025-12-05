import { useState, useEffect } from 'react'
import api from '../../services/api'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [roleModal, setRoleModal] = useState(null)
  const [ordersModal, setOrdersModal] = useState({ open: false, user: null, orders: [], loading: false })

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', 10)
      if (search) params.append('search', search)
      if (roleFilter !== 'all') params.append('role', roleFilter)

      const res = await api.get(`/admin/users?${params.toString()}`)

      if (res.data.users) {
        setUsers(res.data.users)
        setPagination({
          page: res.data.page || page,
          totalPages: res.data.totalPages || 1,
          total: res.data.total || res.data.users.length
        })
      } else {
        setUsers(res.data || [])
        setPagination({
          page: 1,
          totalPages: 1,
          total: res.data?.length || 0
        })
      }
    } catch (error) {
      console.error(error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(1)
  }, [search, roleFilter])

  const handleUpdateRole = async (newRole) => {
    if (!roleModal) return
    try {
      await api.put(`/admin/users/${roleModal._id}/role`, { role: newRole })
      setRoleModal(null)
      fetchUsers(pagination.page)
    } catch (error) {
      console.error(error)
    }
  }

  const openOrdersModal = async (user) => {
    setOrdersModal({ open: true, user, orders: [], loading: true })
    try {
      const res = await api.get(`/admin/users/${user._id}/orders`)
      setOrdersModal(prev => ({ ...prev, orders: res.data || [], loading: false }))
    } catch (error) {
      console.error(error)
      setOrdersModal(prev => ({ ...prev, loading: false }))
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
  }

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700',
      user: 'bg-blue-100 text-blue-700'
    }
    const texts = {
      admin: 'Quản trị',
      user: 'Khách hàng'
    }
    return (
      <span className={`px-2.5 py-1 rounded-lg text-[12px] font-medium ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
        {texts[role] || role}
      </span>
    )
  }

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
      <span className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {texts[status] || status}
      </span>
    )
  }

  const getPageNumbers = () => {
    const pages = []
    const { page, totalPages } = pagination

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#2D2D2D]">Khách hàng</h1>
          <p className="text-[14px] text-[#6B6B6B] mt-1">{pagination.total} tài khoản</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#EBEBEB] rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'user', label: 'Khách hàng' },
            { value: 'admin', label: 'Quản trị' }
          ].map((role) => (
            <button
              key={role.value}
              onClick={() => setRoleFilter(role.value)}
              className={`px-4 py-2.5 text-[13px] font-medium rounded-xl transition-colors ${
                roleFilter === role.value
                  ? 'bg-[#7C9A82] text-white'
                  : 'bg-white text-[#6B6B6B] border border-[#EBEBEB] hover:border-[#7C9A82]'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EBEBEB]">
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Khách hàng</th>
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Email</th>
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Vai trò</th>
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Ngày tạo</th>
                  <th className="text-right px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-[#EBEBEB] last:border-0 hover:bg-[#FAFAF8]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#7C9A82] flex items-center justify-center text-white text-[14px] font-medium">
                          {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <p className="text-[14px] font-medium text-[#2D2D2D]">{user.fullName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[14px] text-[#6B6B6B]">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[14px] text-[#6B6B6B]">{formatDate(user.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openOrdersModal(user)}
                          className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] hover:bg-[#F5F5F3] rounded-lg transition-colors"
                          title="Xem lịch sử mua hàng"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setRoleModal(user)}
                          className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] hover:bg-[#F5F5F3] rounded-lg transition-colors"
                          title="Đổi vai trò"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-[#6B6B6B]">Chưa có khách hàng nào</p>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => fetchUsers(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-lg border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {getPageNumbers().map((pageNum, idx) => (
            <button
              key={idx}
              onClick={() => typeof pageNum === 'number' && fetchUsers(pageNum)}
              disabled={pageNum === '...'}
              className={`min-w-[40px] h-10 rounded-lg text-[14px] font-medium transition-colors ${
                pageNum === pagination.page
                  ? 'bg-[#7C9A82] text-white'
                  : pageNum === '...'
                  ? 'text-[#9A9A9A] cursor-default'
                  : 'border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82]'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => fetchUsers(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 rounded-lg border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {roleModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setRoleModal(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-2">Thay đổi vai trò</h3>
            <p className="text-[14px] text-[#6B6B6B] mb-5">
              Chọn vai trò mới cho {roleModal.fullName}
            </p>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleUpdateRole('user')}
                className={`flex items-center gap-3 w-full p-4 rounded-xl border transition-colors ${
                  roleModal.role === 'user'
                    ? 'border-[#7C9A82] bg-[#F5FAF6]'
                    : 'border-[#EBEBEB] hover:border-[#7C9A82]'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-medium text-[#2D2D2D]">Khách hàng</p>
                  <p className="text-[12px] text-[#6B6B6B]">Chỉ có thể mua hàng</p>
                </div>
              </button>
              <button
                onClick={() => handleUpdateRole('admin')}
                className={`flex items-center gap-3 w-full p-4 rounded-xl border transition-colors ${
                  roleModal.role === 'admin'
                    ? 'border-[#7C9A82] bg-[#F5FAF6]'
                    : 'border-[#EBEBEB] hover:border-[#7C9A82]'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-medium text-[#2D2D2D]">Quản trị viên</p>
                  <p className="text-[12px] text-[#6B6B6B]">Toàn quyền quản lý</p>
                </div>
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setRoleModal(null)}
                className="px-5 py-2.5 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </>
      )}

      {ordersModal.open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setOrdersModal({ open: false, user: null, orders: [], loading: false })} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl p-6 z-50 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[18px] font-semibold text-[#2D2D2D]">Lịch sử mua hàng</h3>
                <p className="text-[14px] text-[#6B6B6B]">{ordersModal.user?.fullName} - {ordersModal.user?.email}</p>
              </div>
              <button
                onClick={() => setOrdersModal({ open: false, user: null, orders: [], loading: false })}
                className="p-2 text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {ordersModal.loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : ordersModal.orders.length > 0 ? (
              <div className="space-y-4">
                {ordersModal.orders.map((order) => (
                  <div key={order._id} className="border border-[#EBEBEB] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <p className="text-[14px] font-medium text-[#7C9A82]">#{order._id.slice(-8).toUpperCase()}</p>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-[13px] text-[#6B6B6B]">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="space-y-2">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.product?.images?.[0] || '/placeholder.png'}
                            alt={item.product?.name}
                            className="w-10 h-10 rounded-lg object-cover bg-[#F5F5F3]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] text-[#2D2D2D] truncate">{item.product?.name}</p>
                            <p className="text-[12px] text-[#6B6B6B]">x{item.quantity}</p>
                          </div>
                          <p className="text-[13px] font-medium text-[#2D2D2D]">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <p className="text-[12px] text-[#6B6B6B]">+{order.items.length - 3} sản phẩm khác</p>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#EBEBEB] flex items-center justify-between">
                      <span className="text-[13px] text-[#6B6B6B]">Tổng cộng</span>
                      <span className="text-[15px] font-semibold text-[#2D2D2D]">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-[#6B6B6B]">Khách hàng chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default AdminUsers
