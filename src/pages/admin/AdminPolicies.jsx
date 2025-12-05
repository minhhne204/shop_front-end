import { useState, useEffect } from 'react'
import api from '../../services/api'

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null })
  const [form, setForm] = useState({ type: '', title: '', content: '' })

  const policyTypes = [
    { value: 'shipping', label: 'Chính sách vận chuyển' },
    { value: 'return', label: 'Chính sách đổi trả' },
    { value: 'payment', label: 'Chính sách thanh toán' },
    { value: 'warranty', label: 'Chính sách bảo hành' },
    { value: 'privacy', label: 'Chính sách bảo mật' },
    { value: 'terms', label: 'Điều khoản sử dụng' }
  ]

  const fetchPolicies = async () => {
    try {
      const res = await api.get('/policies')
      setPolicies(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolicies()
  }, [])

  const openAddModal = () => {
    setForm({ type: '', title: '', content: '' })
    setModal({ open: true, mode: 'add', data: null })
  }

  const openEditModal = (policy) => {
    setForm({
      type: policy.type || '',
      title: policy.title || '',
      content: policy.content || ''
    })
    setModal({ open: true, mode: 'edit', data: policy })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modal.mode === 'add') {
        await api.post('/admin/policies', form)
      } else {
        await api.put(`/admin/policies/${modal.data._id}`, form)
      }
      setModal({ open: false, mode: 'add', data: null })
      fetchPolicies()
    } catch (error) {
      console.error(error)
    }
  }

  const getPolicyLabel = (type) => {
    const policy = policyTypes.find(p => p.value === type)
    return policy ? policy.label : type
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#2D2D2D]">Chính sách</h1>
          <p className="text-[14px] text-[#6B6B6B] mt-1">{policies.length} chính sách</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm chính sách
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : policies.length > 0 ? (
          <div className="divide-y divide-[#EBEBEB]">
            {policies.map((policy) => (
              <div key={policy._id} className="flex items-center justify-between p-5 hover:bg-[#FAFAF8] transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#2D2D2D]">{policy.title}</p>
                      <p className="text-[12px] text-[#6B6B6B] mt-0.5">{getPolicyLabel(policy.type)}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openEditModal(policy)}
                  className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] hover:bg-[#F5F5F3] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[#6B6B6B]">Chưa có chính sách nào</p>
          </div>
        )}
      </div>

      {modal.open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setModal({ open: false, mode: 'add', data: null })} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl p-6 z-50 max-h-[90vh] overflow-y-auto">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-5">
              {modal.mode === 'add' ? 'Thêm chính sách' : 'Sửa chính sách'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Loại chính sách</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                  required
                >
                  <option value="">Chọn loại</option>
                  {policyTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
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
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Nội dung</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all resize-none"
                  placeholder="Hỗ trợ Markdown..."
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, mode: 'add', data: null })}
                  className="px-5 py-2.5 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
                >
                  Huỷ
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
    </div>
  )
}

export default AdminPolicies
