import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Loading from '../components/Loading'

const Policies = () => {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)

  const policyTypes = {
    shipping: {
      title: 'Chính sách vận chuyển',
      description: 'Thông tin về phương thức và thời gian giao hàng',
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
    },
    return: {
      title: 'Chính sách đổi trả',
      description: 'Điều kiện và quy trình đổi trả sản phẩm',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    },
    payment: {
      title: 'Chính sách thanh toán',
      description: 'Các phương thức thanh toán được hỗ trợ',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
    },
    privacy: {
      title: 'Chính sách bảo mật',
      description: 'Cam kết bảo vệ thông tin cá nhân của bạn',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    },
    terms: {
      title: 'Điều khoản sử dụng',
      description: 'Các quy định khi sử dụng dịch vụ',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    }
  }

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await api.get('/policies')
        setPolicies(res.data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchPolicies()
  }, [])

  const hasPolicy = (type) => {
    return policies.some(p => p.type === type)
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-3">Chính sách & Điều khoản</h1>
        <p className="text-[15px] text-[#6B6B6B] max-w-lg mx-auto">
          Tìm hiểu các chính sách và điều khoản của GameForge để có trải nghiệm mua sắm tốt nhất
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(policyTypes).map(([type, info]) => {
          const exists = hasPolicy(type)

          return (
            <Link
              key={type}
              to={`/chinh-sach/${type}`}
              className={`bg-white rounded-2xl border border-[#EBEBEB] p-6 transition-all group ${
                exists ? 'hover:border-[#7C9A82] hover:shadow-sm' : 'opacity-60 pointer-events-none'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  exists ? 'bg-[#F5F5F3] group-hover:bg-[#F0F5F1]' : 'bg-[#F5F5F3]'
                }`}>
                  <svg
                    className={`w-6 h-6 transition-colors ${
                      exists ? 'text-[#7C9A82]' : 'text-[#9A9A9A]'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={info.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-[16px] font-medium transition-colors ${
                      exists ? 'text-[#2D2D2D] group-hover:text-[#7C9A82]' : 'text-[#9A9A9A]'
                    }`}>
                      {info.title}
                    </h3>
                    {!exists && (
                      <span className="px-2 py-0.5 bg-[#F5F5F3] text-[#9A9A9A] text-[11px] rounded-full">
                        Chưa có
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] text-[#6B6B6B] leading-relaxed">
                    {info.description}
                  </p>
                </div>
                {exists && (
                  <svg
                    className="w-5 h-5 text-[#9A9A9A] group-hover:text-[#7C9A82] transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-12 bg-[#F5F5F3] rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-[16px] font-medium text-[#2D2D2D] mb-1">Cần hỗ trợ thêm?</h3>
            <p className="text-[14px] text-[#6B6B6B]">
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:contact@gameforge.vn"
              className="px-5 py-2.5 bg-white text-[#2D2D2D] text-[14px] font-medium rounded-xl hover:bg-[#7C9A82] hover:text-white transition-colors text-center"
            >
              Gửi email
            </a>
            <a
              href="tel:1900xxxx"
              className="px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors text-center"
            >
              1900 xxxx
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Policies
