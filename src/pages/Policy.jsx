import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import Loading from '../components/Loading'

const Policy = () => {
  const { type } = useParams()
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)

  const policyTypes = {
    shipping: { title: 'Chính sách vận chuyển', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
    return: { title: 'Chính sách đổi trả', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    payment: { title: 'Chính sách thanh toán', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    privacy: { title: 'Quyền riêng tư', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    terms: { title: 'Điều khoản sử dụng', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
  }

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await api.get(`/policies/${type}`)
        setPolicy(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchPolicy()
  }, [type])

  if (loading) return <Loading />
  if (!policy) return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-[#6B6B6B]">Không tìm thấy chính sách</p>
    </div>
  )

  const currentPolicy = policyTypes[type] || { title: policy.title, icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      <nav className="flex items-center gap-2 text-[14px] mb-8">
        <Link to="/" className="text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors">Trang chủ</Link>
        <svg className="w-4 h-4 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-[#2D2D2D] font-medium">{currentPolicy.title}</span>
      </nav>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 md:p-10">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#EBEBEB]">
          <div className="w-14 h-14 bg-[#F5F5F3] rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={currentPolicy.icon} />
            </svg>
          </div>
          <h1 className="text-[24px] font-semibold text-[#2D2D2D]">{policy.title}</h1>
        </div>
        <div className="text-[15px] text-[#6B6B6B] leading-relaxed whitespace-pre-line">
          {policy.content}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(policyTypes).filter(([key]) => key !== type).map(([key, value]) => (
          <Link
            key={key}
            to={`/chinh-sach/${key}`}
            className="bg-white rounded-xl border border-[#EBEBEB] p-4 text-center hover:border-[#7C9A82] transition-all group"
          >
            <div className="w-10 h-10 mx-auto mb-3 bg-[#F5F5F3] rounded-lg flex items-center justify-center group-hover:bg-[#F0F5F1] transition-colors">
              <svg className="w-5 h-5 text-[#9A9A9A] group-hover:text-[#7C9A82] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={value.icon} />
              </svg>
            </div>
            <span className="text-[13px] text-[#6B6B6B] group-hover:text-[#2D2D2D] transition-colors">{value.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Policy
