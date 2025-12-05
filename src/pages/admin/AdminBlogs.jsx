import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  })

  const fetchBlogs = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('limit', 10)
      if (search) params.append('search', search)
      if (statusFilter !== 'all') params.append('published', statusFilter === 'published')

      const res = await api.get(`/admin/blogs?${params.toString()}`)

      if (res.data.blogs) {
        setBlogs(res.data.blogs)
        setPagination({
          page: res.data.page || page,
          totalPages: res.data.totalPages || 1,
          total: res.data.total || res.data.blogs.length
        })
      } else {
        setBlogs(res.data || [])
        setPagination({
          page: 1,
          totalPages: 1,
          total: res.data?.length || 0
        })
      }
    } catch (error) {
      console.error(error)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs(1)
  }, [search, statusFilter])

  const handleDelete = async () => {
    if (!deleteModal) return
    try {
      await api.delete(`/admin/blogs/${deleteModal._id}`)
      setDeleteModal(null)
      fetchBlogs(pagination.page)
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
          <h1 className="text-[24px] font-semibold text-[#2D2D2D]">Tin tức</h1>
          <p className="text-[14px] text-[#6B6B6B] mt-1">{pagination.total} bài viết</p>
        </div>
        <Link
          to="/admin/tin-tuc/them"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Viết bài mới
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#EBEBEB] rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'published', label: 'Đã đăng' },
            { value: 'draft', label: 'Nháp' }
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`px-4 py-2.5 text-[13px] font-medium rounded-xl transition-colors ${
                statusFilter === status.value
                  ? 'bg-[#7C9A82] text-white'
                  : 'bg-white text-[#6B6B6B] border border-[#EBEBEB] hover:border-[#7C9A82]'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogs.length > 0 ? (
          <div className="divide-y divide-[#EBEBEB]">
            {blogs.map((blog) => (
              <div key={blog._id} className="flex gap-5 p-5 hover:bg-[#FAFAF8] transition-colors">
                {blog.thumbnail ? (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-32 h-24 rounded-xl object-cover bg-[#F5F5F3] flex-shrink-0"
                  />
                ) : (
                  <div className="w-32 h-24 rounded-xl bg-[#F5F5F3] flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-medium text-[#2D2D2D] line-clamp-1">{blog.title}</h3>
                  {blog.excerpt && (
                    <p className="text-[13px] text-[#6B6B6B] mt-1 line-clamp-2">{blog.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[12px] text-[#9A9A9A]">{formatDate(blog.createdAt)}</span>
                    {blog.published ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[11px] font-medium rounded-lg">Đã đăng</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[11px] font-medium rounded-lg">Nháp</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-1">
                  <Link
                    to={`/admin/tin-tuc/${blog._id}`}
                    className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] hover:bg-[#F5F5F3] rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteModal(blog)}
                    className="p-2 text-[#6B6B6B] hover:text-[#C45C4A] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-[#6B6B6B]">Chưa có bài viết nào</p>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => fetchBlogs(pagination.page - 1)}
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
              onClick={() => typeof pageNum === 'number' && fetchBlogs(pageNum)}
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
            onClick={() => fetchBlogs(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 rounded-lg border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {deleteModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setDeleteModal(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-2">Xoá bài viết</h3>
            <p className="text-[14px] text-[#6B6B6B] mb-6">
              Bạn có chắc muốn xoá bài viết "{deleteModal.title}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-5 py-2.5 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-[#C45C4A] text-white text-[14px] font-medium rounded-xl hover:bg-[#a34a3c] transition-colors"
              >
                Xoá
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminBlogs
