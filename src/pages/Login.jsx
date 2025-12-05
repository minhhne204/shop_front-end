import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12 animate-fade-in">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-2">Chào mừng trở lại</h1>
          <p className="text-[15px] text-[#6B6B6B]">Đăng nhập để tiếp tục mua sắm</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8">
          {error && (
            <div className="bg-[#FEF2F2] text-[#C45C4A] text-[14px] px-4 py-3 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
                className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu"
                className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D2D2D] text-white py-4 rounded-xl text-[15px] font-medium hover:bg-[#7C9A82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>
        </div>

        <p className="text-center text-[14px] text-[#6B6B6B] mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" className="text-[#7C9A82] hover:text-[#6B8A71] font-medium transition-colors">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
