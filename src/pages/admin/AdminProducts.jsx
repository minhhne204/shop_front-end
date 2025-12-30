import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    status: '',
    sort: '-createdAt'
  })
  const [deleteModal, setDeleteModal] = useState(null)

  const fetchFilters = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        api.get('/categories?limit=100'),
        api.get('/brands?limit=100')
      ])
      setCategories(categoriesRes.data.categories || categoriesRes.data || [])
      setBrands(brandsRes.data.brands || brandsRes.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchProducts = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.brand) params.append('brand', filters.brand)
      if (filters.status) params.append('status', filters.status)
      if (filters.sort) params.append('sort', filters.sort)

      const res = await api.get(`/admin/products?${params.toString()}`)
      setProducts(res.data.products || [])
      setPagination({
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1,
        total: res.data.total || 0
      })
    } catch (error) {
      console.error(error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFilters()
  }, [])

  useEffect(() => {
    fetchProducts(1)
  }, [filters])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(1)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      status: '',
      sort: '-createdAt'
    })
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    try {
      await api.delete(`/admin/products/${deleteModal._id}`)
      setDeleteModal(null)
      fetchProducts(pagination.page)
    } catch (error) {
      console.error(error)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  const getStatusBadge = (status) => {
    const styles = {
      available: 'bg-green-100 text-green-700',
      order: 'bg-blue-100 text-blue-700',
      preorder: 'bg-purple-100 text-purple-700'
    }
    const texts = {
      available: 'Có sẵn',
      order: 'Đặt hàng',
      preorder: 'Pre-Order'
    }
    return (
      <span className={`px-2 py-1 rounded-lg text-[12px] font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {texts[status] || status}
      </span>
    )
  }

  const hasActiveFilters = filters.search || filters.category || filters.brand || filters.status

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null

    const pages = []
    const maxVisible = 5
    let start = Math.max(1, pagination.page - Math.floor(maxVisible / 2))
    let end = Math.min(pagination.totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center gap-2 p-5 border-t border-[#EBEBEB]">
        <button
          onClick={() => fetchProducts(pagination.page - 1)}
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
              onClick={() => fetchProducts(1)}
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
            onClick={() => fetchProducts(page)}
            className={`w-9 h-9 rounded-lg text-[14px] font-medium transition-colors ${
              page === pagination.page
                ? 'bg-[#7C9A82] text-white'
                : 'border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82]'
            }`}
          >
            {page}
          </button>
        ))}

        {end < pagination.totalPages && (
          <>
            {end < pagination.totalPages - 1 && <span className="px-1 text-[#9A9A9A]">...</span>}
            <button
              onClick={() => fetchProducts(pagination.totalPages)}
              className="w-9 h-9 rounded-lg text-[14px] font-medium border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82] transition-colors"
            >
              {pagination.totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => fetchProducts(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#2D2D2D]">Sản phẩm</h1>
          <p className="text-[14px] text-[#6B6B6B] mt-1">{pagination.total} sản phẩm</p>
        </div>
        <Link
          to="/admin/san-pham/them"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB]">
        <div className="p-5 border-b border-[#EBEBEB]">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F3] border-0 rounded-xl text-[14px] placeholder-[#9A9A9A] focus:ring-2 focus:ring-[#7C9A82] transition-all"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2.5 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all min-w-[150px]"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="px-4 py-2.5 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all min-w-[150px]"
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2.5 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all min-w-[130px]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="available">Có sẵn</option>
              <option value="order">Đặt hàng</option>
              <option value="preorder">Pre-Order</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2.5 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all min-w-[130px]"
            >
              <option value="-createdAt">Mới nhất</option>
              <option value="createdAt">Cũ nhất</option>
              <option value="price">Giá thấp - cao</option>
              <option value="-price">Giá cao - thấp</option>
              <option value="-soldCount">Bán chạy</option>
              <option value="stock">Tồn kho thấp</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2.5 text-[14px] text-[#C45C4A] hover:bg-[#FEF2F2] rounded-xl transition-colors"
              >
                Xoá lọc
              </button>
            )}
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EBEBEB]">
                    <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Sản phẩm</th>
                    <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Giá</th>
                    <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Tồn kho</th>
                    <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Đã bán</th>
                    <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Trạng thái</th>
                    <th className="text-right px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-[#EBEBEB] last:border-0 hover:bg-[#FAFAF8]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.name}
                            className="w-14 h-14 rounded-xl object-cover bg-[#F5F5F3]"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-medium text-[#2D2D2D] line-clamp-1">{product.name}</p>
                              {product.hasVariants && (
                                <span className="px-2 py-0.5 bg-[#F3E8FD] text-[#8A6B9A] text-[10px] font-medium rounded-full whitespace-nowrap">
                                  {product.variants?.length || 0} biến thể
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-[#6B6B6B] mt-0.5">
                              {product.category?.name} - {product.brand?.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[14px] font-medium text-[#2D2D2D]">{formatCurrency(product.salePrice || product.price)}</p>
                        {product.salePrice && (
                          <p className="text-[12px] text-[#9A9A9A] line-through">{formatCurrency(product.price)}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className={`text-[14px] ${product.stock < 5 ? 'text-[#C45C4A] font-medium' : 'text-[#2D2D2D]'}`}>
                          {product.stock}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[14px] text-[#6B6B6B]">{product.soldCount || 0}</p>
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/san-pham/${product._id}`}
                            className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] hover:bg-[#F5F5F3] rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => setDeleteModal(product)}
                            className="p-2 text-[#6B6B6B] hover:text-[#C45C4A] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                            title="Xoá"
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
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-[#6B6B6B]">Không tìm thấy sản phẩm nào</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 text-[14px] text-[#7C9A82] hover:text-[#6B8A71] font-medium"
              >
                Xoá bộ lọc
              </button>
            )}
          </div>
        )}
      </div>

      {deleteModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setDeleteModal(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-2">Xoá sản phẩm</h3>
            <p className="text-[14px] text-[#6B6B6B] mb-6">
              Bạn có chắc muốn xoá sản phẩm "{deleteModal.name}"? Hành động này không thể hoàn tác.
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

export default AdminProducts
