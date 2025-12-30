import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import ImageUpload from '../../components/ImageUpload'

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    brand: '',
    status: 'available',
    stock: '',
    isFeatured: false,
    hasVariants: false,
    variantType: ''
  })
  const [images, setImages] = useState([])
  const [variants, setVariants] = useState([])
  const [showVariantForm, setShowVariantForm] = useState(false)
  const [editingVariantIndex, setEditingVariantIndex] = useState(null)
  const [variantForm, setVariantForm] = useState({
    name: '',
    price: '',
    salePrice: '',
    stock: '',
    sku: '',
    isActive: true
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          api.get('/categories?limit=100'),
          api.get('/brands?limit=100')
        ])
        setCategories(categoriesRes.data.categories || categoriesRes.data || [])
        setBrands(brandsRes.data.brands || brandsRes.data || [])

        if (isEdit) {
          const productRes = await api.get(`/admin/products/${id}`)
          const product = productRes.data
          setForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            salePrice: product.salePrice || '',
            category: product.category?._id || '',
            brand: product.brand?._id || '',
            status: product.status || 'available',
            stock: product.stock || '',
            isFeatured: product.isFeatured || false,
            hasVariants: product.hasVariants || false,
            variantType: product.variantType || ''
          })
          if (product.images?.length > 0) {
            setImages(product.images.map(url => ({ url, publicId: null })))
          }
          if (product.variants?.length > 0) {
            setVariants(product.variants)
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        stock: Number(form.stock),
        images: images.map(img => img.url),
        hasVariants: form.hasVariants,
        variantType: form.variantType,
        variants: form.hasVariants ? variants.map(v => ({
          ...v,
          price: Number(v.price),
          salePrice: v.salePrice ? Number(v.salePrice) : undefined,
          stock: Number(v.stock)
        })) : []
      }

      if (isEdit) {
        await api.put(`/admin/products/${id}`, data)
      } else {
        await api.post('/admin/products', data)
      }
      navigate('/admin/san-pham')
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddVariant = () => {
    if (!variantForm.name || !variantForm.price || !variantForm.stock) {
      alert('Vui lòng điền đầy đủ thông tin biến thể')
      return
    }
    if (editingVariantIndex !== null) {
      const newVariants = [...variants]
      newVariants[editingVariantIndex] = { ...variantForm }
      setVariants(newVariants)
      setEditingVariantIndex(null)
    } else {
      setVariants([...variants, { ...variantForm }])
    }
    setVariantForm({ name: '', price: '', salePrice: '', stock: '', sku: '', isActive: true })
    setShowVariantForm(false)
  }

  const handleEditVariant = (index) => {
    setVariantForm({ ...variants[index] })
    setEditingVariantIndex(index)
    setShowVariantForm(true)
  }

  const handleDeleteVariant = (index) => {
    if (confirm('Bạn có chắc muốn xóa biến thể này?')) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'd'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/san-pham')}
          className="flex items-center gap-2 text-[14px] text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </button>
        <h1 className="text-[24px] font-semibold text-[#2D2D2D]">
          {isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Thông tin cơ bản</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Tên sản phẩm</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Mô tả</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Danh mục</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Thương hiệu</label>
                <select
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                  required
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Giá & Tồn kho</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Giá gốc</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Giá sale</label>
              <input
                type="number"
                value={form.salePrice}
                onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                placeholder="Để trống nếu không sale"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Tồn kho</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Trạng thái</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
              >
                <option value="available">Có sẵn</option>
                <option value="order">Đặt hàng</option>
                <option value="preorder">Pre-Order</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-[#7C9A82] focus:ring-[#7C9A82]"
              />
              <span className="text-[14px] text-[#2D2D2D]">Sản phẩm nổi bật</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-semibold text-[#2D2D2D]">Biến thể sản phẩm</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.hasVariants}
                onChange={(e) => setForm({ ...form, hasVariants: e.target.checked })}
                className="w-4 h-4 rounded text-[#7C9A82] focus:ring-[#7C9A82]"
              />
              <span className="text-[14px] text-[#2D2D2D]">Có biến thể</span>
            </label>
          </div>

          {form.hasVariants && (
            <>
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Loại biến thể</label>
                <input
                  type="text"
                  value={form.variantType}
                  onChange={(e) => setForm({ ...form, variantType: e.target.value })}
                  placeholder="VD: Phiên bản, Kích thước, Màu sắc..."
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                />
              </div>

              {variants.length > 0 && (
                <div className="space-y-3 mb-4">
                  {variants.map((variant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#F5F5F3] rounded-xl">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[14px] font-medium text-[#2D2D2D]">{variant.name}</span>
                          {!variant.isActive && (
                            <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#C45C4A] text-[11px] rounded-full">Ẩn</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-[13px] text-[#6B6B6B]">
                          <span>Giá: {formatPrice(variant.price)}</span>
                          {variant.salePrice && <span className="text-[#7C9A82]">Sale: {formatPrice(variant.salePrice)}</span>}
                          <span>Kho: {variant.stock}</span>
                          {variant.sku && <span>SKU: {variant.sku}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditVariant(index)}
                          className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(index)}
                          className="p-2 text-[#6B6B6B] hover:text-[#C45C4A] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showVariantForm ? (
                <div className="p-4 bg-[#F5F5F3] rounded-xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Tên biến thể *</label>
                      <input
                        type="text"
                        value={variantForm.name}
                        onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
                        placeholder="VD: Standard, Deluxe, Limited..."
                        className="w-full px-4 py-3 bg-white border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">SKU</label>
                      <input
                        type="text"
                        value={variantForm.sku}
                        onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Giá *</label>
                      <input
                        type="number"
                        value={variantForm.price}
                        onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Giá sale</label>
                      <input
                        type="number"
                        value={variantForm.salePrice}
                        onChange={(e) => setVariantForm({ ...variantForm, salePrice: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Tồn kho *</label>
                      <input
                        type="number"
                        value={variantForm.stock}
                        onChange={(e) => setVariantForm({ ...variantForm, stock: e.target.value })}
                        className="w-full px-4 py-3 bg-white border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={variantForm.isActive}
                        onChange={(e) => setVariantForm({ ...variantForm, isActive: e.target.checked })}
                        className="w-4 h-4 rounded text-[#7C9A82] focus:ring-[#7C9A82]"
                      />
                      <span className="text-[14px] text-[#2D2D2D]">Hiển thị biến thể</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowVariantForm(false)
                          setEditingVariantIndex(null)
                          setVariantForm({ name: '', price: '', salePrice: '', stock: '', sku: '', isActive: true })
                        }}
                        className="px-4 py-2 text-[14px] text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={handleAddVariant}
                        className="px-4 py-2 bg-[#7C9A82] text-white text-[14px] rounded-lg hover:bg-[#6B8A71] transition-colors"
                      >
                        {editingVariantIndex !== null ? 'Cập nhật' : 'Thêm'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowVariantForm(true)}
                  className="w-full py-3 border-2 border-dashed border-[#EBEBEB] rounded-xl text-[14px] text-[#6B6B6B] hover:border-[#7C9A82] hover:text-[#7C9A82] transition-colors"
                >
                  + Thêm biến thể
                </button>
              )}
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Hình ảnh sản phẩm</h2>
          <ImageUpload
            value={images}
            onChange={setImages}
            multiple={true}
            maxFiles={10}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/san-pham')}
            className="px-6 py-3 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Thêm sản phẩm')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
