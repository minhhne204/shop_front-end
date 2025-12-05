import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

const BlogForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    published: true
  })

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const res = await api.get(`/blogs/${id}`)
          const blog = res.data
          setForm({
            title: blog.title || '',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            thumbnail: blog.thumbnail || '',
            published: blog.published !== false
          })
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
      fetchBlog()
    }
  }, [id, isEdit])

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
      setForm({ ...form, thumbnail: res.data.url })
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/admin/blogs/${id}`, form)
      } else {
        await api.post('/admin/blogs', form)
      }
      navigate('/admin/tin-tuc')
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
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
          onClick={() => navigate('/admin/tin-tuc')}
          className="flex items-center gap-2 text-[14px] text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </button>
        <h1 className="text-[24px] font-semibold text-[#2D2D2D]">
          {isEdit ? 'Sửa bài viết' : 'Viết bài mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <div className="space-y-4">
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
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Mô tả ngắn</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all resize-none"
                placeholder="Mô tả ngắn hiển thị ở danh sách bài viết"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Ảnh đại diện</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {form.thumbnail ? (
                <div className="relative inline-block">
                  <img
                    src={form.thumbnail}
                    alt="Preview"
                    className="w-full max-w-md h-48 rounded-xl object-cover bg-[#F5F5F3]"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, thumbnail: '' })}
                    className="absolute top-2 right-2 w-8 h-8 bg-[#C45C4A] text-white rounded-full flex items-center justify-center hover:bg-[#a34a3c]"
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
                  className="w-full max-w-md py-12 border-2 border-dashed border-[#EBEBEB] rounded-xl hover:border-[#7C9A82] transition-colors"
                >
                  {uploading ? (
                    <div className="w-6 h-6 mx-auto border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="text-center">
                      <svg className="w-10 h-10 mx-auto text-[#9A9A9A] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-[13px] text-[#6B6B6B]">Click để tải ảnh lên</p>
                    </div>
                  )}
                </button>
              )}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Nội dung</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all resize-none font-mono"
                placeholder="Hỗ trợ Markdown..."
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#7C9A82] focus:ring-[#7C9A82]"
                />
                <span className="text-[14px] text-[#2D2D2D]">Xuất bản ngay</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/tin-tuc')}
            className="px-6 py-3 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Đăng bài')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm
