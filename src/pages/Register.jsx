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
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12 animate-fade-in">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-2">Tạo tài khoản</h1>
          <p className="text-[15px] text-[#6B6B6B]">Đăng ký để bắt đầu mua sắm</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8">
          {error && (
            <div className="bg-[#FEF2F2] text-[#C45C4A] text-[14px] px-4 py-3 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Họ tên</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Nhập họ tên của bạn"
                className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
                className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Tối thiểu 6 ký tự"
                className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Nhập lại mật khẩu"
                className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D2D2D] text-white py-4 rounded-xl text-[15px] font-medium hover:bg-[#7C9A82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>
        </div>

        <p className="text-center text-[14px] text-[#6B6B6B] mt-6">
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" className="text-[#7C9A82] hover:text-[#6B8A71] font-medium transition-colors">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
