import { useState, useEffect, useRef } from 'react'
import api from '../../services/api'

const AdminBanners = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null })
  const [form, setForm] = useState({ title: '', description: '', image: '', link: '', position: 'home', isActive: true })
  const [deleteModal, setDeleteModal] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const fetchBanners = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', 10)
      if (search) params.append('search', search)
      if (positionFilter !== 'all') params.append('position', positionFilter)

      const res = await api.get(`/admin/banners?${params.toString()}`)

      if (res.data.banners) {
        setBanners(res.data.banners)
        setPagination({
          page: res.data.page || page,
          totalPages: res.data.totalPages || 1,
          total: res.data.total || res.data.banners.length
        })
      } else {
        setBanners(res.data || [])
        setPagination({
          page: 1,
          totalPages: 1,
          total: res.data?.length || 0
        })
      }
    } catch (error) {
      console.error(error)
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners(1)
  }, [search, positionFilter])

  const openAddModal = () => {
    setForm({ title: '', description: '', image: '', link: '', position: 'home', isActive: true })
    setModal({ open: true, mode: 'add', data: null })
  }

  const openEditModal = (banner) => {
    setForm({
      title: banner.title || '',
      description: banner.description || '',
      image: banner.image || '',
      link: banner.link || '',
      position: banner.position || 'home',
      isActive: banner.isActive !== false
    })
    setModal({ open: true, mode: 'edit', data: banner })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setForm({ ...form, image: res.data.url })
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modal.mode === 'add') {
        await api.post('/admin/banners', form)
      } else {
        await api.put(`/admin/banners/${modal.data._id}`, form)
      }
      setModal({ open: false, mode: 'add', data: null })
      fetchBanners(pagination.page)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    try {
      await api.delete(`/admin/banners/${deleteModal._id}`)
      setDeleteModal(null)
      fetchBanners(pagination.page)
    } catch (error) {
      console.error(error)
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
          <h1 className="text-[24px] font-semibold text-[#2D2D2D]">Banner</h1>
          <p className="text-[14px] text-[#6B6B6B] mt-1">{pagination.total} banner</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm banner
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm banner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#EBEBEB] rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'home', label: 'Trang chủ' },
            { value: 'products', label: 'Sản phẩm' },
            { value: 'sidebar', label: 'Thanh bên' }
          ].map((pos) => (
            <button
              key={pos.value}
              onClick={() => setPositionFilter(pos.value)}
              className={`px-4 py-2.5 text-[13px] font-medium rounded-xl transition-colors ${
                positionFilter === pos.value
                  ? 'bg-[#7C9A82] text-white'
                  : 'bg-white text-[#6B6B6B] border border-[#EBEBEB] hover:border-[#7C9A82]'
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : banners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="rounded-xl border border-[#EBEBEB] overflow-hidden hover:border-[#7C9A82] transition-colors"
              >
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-40 object-cover bg-[#F5F5F3]"
                  />
                ) : (
                  <div className="w-full h-40 bg-[#F5F5F3] flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-medium text-[#2D2D2D] line-clamp-1">{banner.title || 'Không có tiêu đề'}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-[#F5F5F3] text-[#6B6B6B] text-[11px] font-medium rounded-lg">
                          {banner.position === 'home' ? 'Trang chủ' : banner.position === 'products' ? 'Sản phẩm' : banner.position}
                        </span>
                        {banner.isActive ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[11px] font-medium rounded-lg">Hiển thị</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-lg">Ẩn</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(banner)}
                        className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] hover:bg-[#F5F5F3] rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteModal(banner)}
                        className="p-2 text-[#6B6B6B] hover:text-[#C45C4A] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[#6B6B6B]">Chưa có banner nào</p>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => fetchBanners(pagination.page - 1)}
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
              onClick={() => typeof pageNum === 'number' && fetchBanners(pageNum)}
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
            onClick={() => fetchBanners(pagination.page + 1)}
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
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl p-6 z-50 max-h-[90vh] overflow-y-auto">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-5">
              {modal.mode === 'add' ? 'Thêm banner' : 'Sửa banner'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Tiêu đề</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Hình ảnh</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {form.image ? (
                  <div className="relative">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-40 rounded-xl object-cover bg-[#F5F5F3]"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: '' })}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 text-[#C45C4A] rounded-lg flex items-center justify-center hover:bg-white shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full py-10 border-2 border-dashed border-[#EBEBEB] rounded-xl hover:border-[#7C9A82] transition-colors"
                  >
                    {uploading ? (
                      <div className="w-6 h-6 mx-auto border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="text-center">
                        <svg className="w-10 h-10 mx-auto text-[#9A9A9A] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-[13px] text-[#6B6B6B]">Click để tải ảnh banner</p>
                        <p className="text-[12px] text-[#9A9A9A] mt-1">Khuyến nghị 1920x600px</p>
                      </div>
                    )}
                  </button>
                )}
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Link điều hướng</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                  placeholder="/san-pham"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Vị trí</label>
                <select
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                >
                  <option value="home">Trang chủ</option>
                  <option value="products">Trang sản phẩm</option>
                  <option value="sidebar">Thanh bên</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#7C9A82] focus:ring-[#7C9A82]"
                />
                <label htmlFor="isActive" className="text-[14px] text-[#2D2D2D]">Hiển thị banner</label>
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
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-2">Xóa banner</h3>
            <p className="text-[14px] text-[#6B6B6B] mb-6">
              Bạn có chắc muốn xóa banner này?
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
    </div>
  )
}

export default AdminBanners
