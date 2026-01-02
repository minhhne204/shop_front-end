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
  <div className="bg-[#F7F7F8] py-16 px-4">
    <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-12 items-center">

      {/* LEFT - BRAND */}
      <div className="hidden md:block">
        <h1 className="text-4xl font-bold text-[#2D2D2D] mb-4">
          Toy<span className="text-[#7C9A82]">Nime</span>
        </h1>
        <p className="text-[#6B6B6B] text-lg mb-6">
          Cửa hàng figure & mô hình anime chính hãng
        </p>

        <ul className="space-y-3 text-[#6B6B6B]">
          <li>✔ Sản phẩm chính hãng 100%</li>
          <li>✔ Pre-order giá tốt</li>
          <li>✔ Giao hàng toàn quốc</li>
        </ul>
      </div>

      {/* RIGHT - LOGIN */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#EBEBEB] p-8 max-w-[420px] mx-auto w-full">
        <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
          Đăng nhập
        </h2>
        <p className="text-sm text-[#6B6B6B] mb-6">
          Đăng nhập để tiếp tục mua sắm
        </p>

        {error && (
          <div className="bg-[#FEF2F2] text-[#C45C4A] text-sm px-4 py-3 rounded-xl mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm focus:border-[#7C9A82] focus:ring-2 focus:ring-[#7C9A82]/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu"
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm focus:border-[#7C9A82] focus:ring-2 focus:ring-[#7C9A82]/20 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D2D2D] text-white py-3.5 rounded-xl font-medium hover:bg-[#7C9A82] transition disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-sm text-[#6B6B6B] mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" className="text-[#7C9A82] font-medium hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  </div>
)

}

export default Login
