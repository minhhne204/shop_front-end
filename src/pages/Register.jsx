import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu không khớp')
      return
    }

    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)

    try {
      await register(form.email, form.password, form.fullName)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại')
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
          Tạo tài khoản để mua sắm nhanh hơn
        </p>

        <ul className="space-y-3 text-[#6B6B6B]">
          <li>✔ Theo dõi đơn hàng dễ dàng</li>
          <li>✔ Lưu sản phẩm yêu thích</li>
          <li>✔ Nhận ưu đãi & thông báo sớm</li>
        </ul>
      </div>

      {/* RIGHT - REGISTER FORM */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#EBEBEB] p-8 max-w-[420px] mx-auto w-full">
        <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
          Tạo tài khoản
        </h2>
        <p className="text-sm text-[#6B6B6B] mb-6">
          Đăng ký để bắt đầu mua sắm
        </p>

        {error && (
          <div className="bg-[#FEF2F2] text-[#C45C4A] text-sm px-4 py-3 rounded-xl mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
              Họ tên
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              placeholder="Nhập họ tên của bạn"
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm
              focus:border-[#7C9A82] focus:ring-2 focus:ring-[#7C9A82]/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm
              focus:border-[#7C9A82] focus:ring-2 focus:ring-[#7C9A82]/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Tối thiểu 6 ký tự"
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm
              focus:border-[#7C9A82] focus:ring-2 focus:ring-[#7C9A82]/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu"
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm
              focus:border-[#7C9A82] focus:ring-2 focus:ring-[#7C9A82]/20 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D2D2D] text-white py-3.5 rounded-xl font-medium
            hover:bg-[#7C9A82] transition disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-sm text-[#6B6B6B] mt-6">
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" className="text-[#7C9A82] font-medium hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  </div>
)

}

export default Register
