import { useState, useEffect } from 'react'
import api from '../../services/api'

const AdminPreOrders = () => {
  const [preOrders, setPreOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null })
  const [form, setForm] = useState({ product: '', expectedDate: '', quantity: '', isActive: true })
  const [deleteModal, setDeleteModal] = useState(null)
  const [registrationsModal, setRegistrationsModal] = useState({ open: false, preOrder: null, registrations: [] })

  const fetchPreOrders = async (page = 1) => {
    setLoading(true)
    try {
      const res = await api.get(`/admin/preorders?page=${page}&limit=10`)
      if (res.data.preOrders) {
        setPreOrders(res.data.preOrders)
        setPagination({
          page: res.data.page || page,
          totalPages: res.data.totalPages || 1,
          total: res.data.total || res.data.preOrders.length
        })
      } else {
        setPreOrders(res.data || [])
      }
    } catch (error) {
      console.error(error)
      setPreOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await api.get('/admin/products?limit=100')
      setProducts(res.data.products || res.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchPreOrders()
    fetchProducts()
  }, [])

  const openAddModal = () => {
    setForm({ product: '', expectedDate: '', quantity: '', isActive: true })
    setModal({ open: true, mode: 'add', data: null })
  }

  const openEditModal = (preOrder) => {
    setForm({
      product: preOrder.product?._id || '',
      expectedDate: preOrder.expectedDate ? new Date(preOrder.expectedDate).toISOString().split('T')[0] : '',
      quantity: preOrder.quantity || '',
      isActive: preOrder.isActive !== false
    })
    setModal({ open: true, mode: 'edit', data: preOrder })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modal.mode === 'add') {
        await api.post('/admin/preorders', form)
      } else {
        await api.put(`/admin/preorders/${modal.data._id}`, form)
      }
      setModal({ open: false, mode: 'add', data: null })
      fetchPreOrders(pagination.page)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    try {
      await api.delete(`/admin/preorders/${deleteModal._id}`)
      setDeleteModal(null)
      fetchPreOrders(pagination.page)
    } catch (error) {
      console.error(error)
    }
  }

  const openRegistrationsModal = async (preOrder) => {
    try {
      const res = await api.get(`/admin/preorders/${preOrder._id}/registrations`)
      setRegistrationsModal({ open: true, preOrder, registrations: res.data || [] })
    } catch (error) {
      console.error(error)
    }
  }

  const updateRegistrationStatus = async (registrationId, status) => {
    try {
      await api.put(`/admin/preorders/registrations/${registrationId}`, { status })
      const res = await api.get(`/admin/preorders/${registrationsModal.preOrder._id}/registrations`)
      setRegistrationsModal(prev => ({ ...prev, registrations: res.data || [] }))
      fetchPreOrders(pagination.page)
    } catch (error) {
      console.error(error)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[12px] font-medium rounded-lg">Đã xác nhận</span>
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[12px] font-medium rounded-lg">Đã hủy</span>
      default:
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-[12px] font-medium rounded-lg">Chờ xử lý</span>
    }
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
          <h1 className="text-[24px] font-semibold text-[#2D2D2D]">Quản lý Pre-Order</h1>
          <p className="text-[14px] text-[#6B6B6B] mt-1">{pagination.total} đợt hàng</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm đợt hàng
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : preOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EBEBEB]">
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Sản phẩm</th>
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Ngày dự kiến</th>
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Số lượng</th>
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Đã đăng ký</th>
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Trạng thái</th>
                  <th className="text-right px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {preOrders.map((preOrder) => (
                  <tr key={preOrder._id} className="border-b border-[#EBEBEB] last:border-0 hover:bg-[#FAFAF8]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={preOrder.product?.images?.[0] || '/placeholder.png'}
                          alt={preOrder.product?.name}
                          className="w-12 h-12 rounded-lg object-cover bg-[#F5F5F3]"
                        />
                        <div>
                          <p className="text-[14px] font-medium text-[#2D2D2D] line-clamp-1">
                            {preOrder.product?.name || 'Sản phẩm đã xóa'}
                          </p>
                          <p className="text-[12px] text-[#6B6B6B]">{formatPrice(preOrder.product?.price || 0)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[14px] text-[#2D2D2D]">{formatDate(preOrder.expectedDate)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[14px] text-[#2D2D2D]">{preOrder.quantity}</p>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => openRegistrationsModal(preOrder)}
                        className="text-[14px] text-[#7C9A82] hover:text-[#6B8A71] font-medium"
                      >
                        {preOrder.currentOrders || 0} đăng ký
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      {preOrder.isActive ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[12px] font-medium rounded-lg">
                          Đang mở
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[12px] font-medium rounded-lg">
                          Đã đóng
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(preOrder)}
                          className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] hover:bg-[#F5F5F3] rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteModal(preOrder)}
                          className="p-2 text-[#6B6B6B] hover:text-[#C45C4A] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[#6B6B6B]">Chưa có đợt hàng nào</p>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => fetchPreOrders(pagination.page - 1)}
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
              onClick={() => typeof pageNum === 'number' && fetchPreOrders(pageNum)}
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
            onClick={() => fetchPreOrders(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 rounded-lg border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {modal.open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setModal({ open: false, mode: 'add', data: null })} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-5">
              {modal.mode === 'add' ? 'Thêm đợt hàng' : 'Sửa đợt hàng'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Sản phẩm</label>
                <select
                  value={form.product}
                  onChange={(e) => setForm({ ...form, product: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                  required
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Ngày dự kiến về hàng</label>
                <input
                  type="date"
                  value={form.expectedDate}
                  onChange={(e) => setForm({ ...form, expectedDate: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Số lượng dự kiến</label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                  required
                  min="1"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#7C9A82] focus:ring-[#7C9A82]"
                />
                <label htmlFor="isActive" className="text-[14px] text-[#2D2D2D]">Đang mở đặt hàng</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, mode: 'add', data: null })}
                  className="px-5 py-2.5 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
                >
                  {modal.mode === 'add' ? 'Thêm' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {deleteModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setDeleteModal(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-2">Xóa đợt hàng</h3>
            <p className="text-[14px] text-[#6B6B6B] mb-6">
              Bạn có chắc muốn xóa đợt hàng này? Tất cả đăng ký sẽ bị xóa.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-5 py-2.5 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-[#C45C4A] text-white text-[14px] font-medium rounded-xl hover:bg-[#a34a3c] transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </>
      )}

      {registrationsModal.open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setRegistrationsModal({ open: false, preOrder: null, registrations: [] })} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl p-6 z-50 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[18px] font-semibold text-[#2D2D2D]">Danh sách đăng ký</h3>
                <p className="text-[14px] text-[#6B6B6B]">{registrationsModal.preOrder?.product?.name}</p>
              </div>
              <button
                onClick={() => setRegistrationsModal({ open: false, preOrder: null, registrations: [] })}
                className="p-2 text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {registrationsModal.registrations.length > 0 ? (
              <div className="space-y-3">
                {registrationsModal.registrations.map((reg) => (
                  <div key={reg._id} className="flex items-center justify-between p-4 bg-[#F5F5F3] rounded-xl">
                    <div>
                      <p className="text-[14px] font-medium text-[#2D2D2D]">{reg.user?.fullName}</p>
                      <p className="text-[13px] text-[#6B6B6B]">{reg.user?.email}</p>
                      <p className="text-[13px] text-[#6B6B6B]">SĐT: {reg.user?.phone || 'Chưa có'}</p>
                      <p className="text-[13px] text-[#6B6B6B]">Số lượng: {reg.quantity}</p>
                      {reg.note && <p className="text-[13px] text-[#9A9A9A] mt-1">Ghi chú: {reg.note}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(reg.status)}
                      {reg.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateRegistrationStatus(reg._id, 'confirmed')}
                            className="px-3 py-1.5 bg-green-500 text-white text-[12px] font-medium rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Xác nhận
                          </button>
                          <button
                            onClick={() => updateRegistrationStatus(reg._id, 'cancelled')}
                            className="px-3 py-1.5 bg-red-500 text-white text-[12px] font-medium rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-[#6B6B6B]">Chưa có đăng ký nào</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default AdminPreOrders
