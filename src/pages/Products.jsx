import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || '-createdAt',
    search: searchParams.get('search') || ''
  })

  const [priceRange, setPriceRange] = useState({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  })

  useEffect(() => {
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
    fetchFilters()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value)
        })
        if (priceRange.minPrice) params.append('minPrice', priceRange.minPrice)
        if (priceRange.maxPrice) params.append('maxPrice', priceRange.maxPrice)
        params.append('page', searchParams.get('page') || '1')

        const res = await api.get(`/products?${params.toString()}`)
        setProducts(res.data.products)
        setPagination({
          page: res.data.page,
          pages: res.data.pages,
          total: res.data.total
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [filters, searchParams])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    if (priceRange.minPrice) params.set('minPrice', priceRange.minPrice)
    if (priceRange.maxPrice) params.set('maxPrice', priceRange.maxPrice)
    setSearchParams(params)
  }

  const handlePriceBlur = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    if (priceRange.minPrice) params.set('minPrice', priceRange.minPrice)
    if (priceRange.maxPrice) params.set('maxPrice', priceRange.maxPrice)
    setSearchParams(params)
  }

  const handlePageChange = (page) => {
    searchParams.set('page', page)
    setSearchParams(searchParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      status: '',
      sort: '-createdAt',
      search: ''
    })
    setPriceRange({ minPrice: '', maxPrice: '' })
    setSearchParams({})
  }

  const hasActiveFilters = filters.category || filters.brand || filters.status || priceRange.minPrice || priceRange.maxPrice || filters.search

  const filterContent = (
    <div className="space-y-6">
      <div>
        <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2.5">Danh mục</label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] focus:border-[#7C9A82] transition-colors appearance-none cursor-pointer"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2.5">Thương hiệu</label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] focus:border-[#7C9A82] transition-colors appearance-none cursor-pointer"
        >
          <option value="">Tất cả thương hiệu</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>{brand.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2.5">Trạng thái</label>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] focus:border-[#7C9A82] transition-colors appearance-none cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="available">Có sẵn</option>
          <option value="order">Đặt hàng</option>
          <option value="preorder">Pre-Order</option>
        </select>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2.5">Khoảng giá</label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Giá từ"
            value={priceRange.minPrice}
            onChange={(e) => setPriceRange(prev => ({ ...prev, minPrice: e.target.value }))}
            onBlur={handlePriceBlur}
            onKeyDown={(e) => e.key === 'Enter' && handlePriceBlur()}
            className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
          />
          <input
            type="number"
            placeholder="Giá đến"
            value={priceRange.maxPrice}
            onChange={(e) => setPriceRange(prev => ({ ...prev, maxPrice: e.target.value }))}
            onBlur={handlePriceBlur}
            onKeyDown={(e) => e.key === 'Enter' && handlePriceBlur()}
            className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 text-[14px] text-[#C45C4A] hover:text-[#a34a3c] transition-colors"
        >
          Xoá bộ lọc
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-2">
          {filters.search ? `Kết quả tìm kiếm: "${filters.search}"` : 'Tất cả sản phẩm'}
        </h1>
        <p className="text-[15px] text-[#6B6B6B]">Khám phá bộ sưu tập mô hình của chúng tôi</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block lg:w-[260px] flex-shrink-0">
          <div className="sticky top-[100px]">
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <h3 className="text-[15px] font-semibold text-[#2D2D2D] mb-5">Bộ lọc</h3>
              {filterContent}
            </div>
          </div>
        </aside>

        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-[#EBEBEB] rounded-xl text-[14px] font-medium text-[#2D2D2D]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Bộ lọc
          {hasActiveFilters && <span className="w-2 h-2 bg-[#7C9A82] rounded-full" />}
        </button>

        {mobileFilterOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileFilterOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-[300px] bg-[#FAFAF8] z-50 lg:hidden animate-slide-up">
              <div className="flex items-center justify-between p-4 border-b border-[#EBEBEB]">
                <h3 className="text-[16px] font-semibold text-[#2D2D2D]">Bộ lọc</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                {filterContent}
              </div>
            </div>
          </>
        )}

        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[14px] text-[#6B6B6B]">
              <span className="font-medium text-[#2D2D2D]">{pagination.total}</span> sản phẩm
            </p>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="bg-white border border-[#EBEBEB] rounded-xl px-4 py-2.5 text-[14px] text-[#2D2D2D] focus:border-[#7C9A82] transition-colors appearance-none cursor-pointer pr-10"
            >
              <option value="-createdAt">Mới nhất</option>
              <option value="price">Giá thấp - cao</option>
              <option value="-price">Giá cao - thấp</option>
              <option value="-soldCount">Bán chạy</option>
            </select>
          </div>

          {loading ? (
            <Loading />
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page === 1}
                    className="w-10 h-10 rounded-xl border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-xl text-[14px] font-medium transition-all ${
                        page === pagination.page
                          ? 'bg-[#7C9A82] text-white'
                          : 'border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                    disabled={pagination.page === pagination.pages}
                    className="w-10 h-10 rounded-xl border border-[#EBEBEB] flex items-center justify-center text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#EBEBEB]">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-[#6B6B6B] mb-2">Không tìm thấy sản phẩm nào</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[14px] text-[#7C9A82] hover:text-[#6B8A71] font-medium"
                >
                  Xoá bộ lọc
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Products
