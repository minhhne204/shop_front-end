import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Header = () => {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/san-pham?search=${encodeURIComponent(search)}`)
      setSearch('')
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)]'
          : 'bg-[#FAFAF8]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-[72px]">
          <Link
            to="/"
            className="text-[22px] font-semibold tracking-tight text-[#2D2D2D] hover:text-[#7C9A82] transition-colors duration-300"
          >
            ToyNime
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/san-pham"
              className="text-[15px] text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors duration-200 relative group"
            >
              Sản phẩm
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#7C9A82] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              to="/pre-order"
              className="text-[15px] text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors duration-200 relative group"
            >
              Pre-Order
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#7C9A82] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              to="/tin-tuc"
              className="text-[15px] text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors duration-200 relative group"
            >
              Tin tức
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#7C9A82] transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-[200px] pl-10 pr-4 py-2.5 bg-white border border-[#EBEBEB] rounded-full text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] focus:w-[260px] transition-all duration-300"
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            {user && (
              <Link
                to="/yeu-thich"
                className="relative p-2.5 text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors duration-200"
              >
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
            )}

            <Link
              to="/gio-hang"
              className="relative p-2.5 text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors duration-200"
            >
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#7C9A82] text-white text-[11px] font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 pl-4 pr-3 py-2 bg-white border border-[#EBEBEB] rounded-full text-[14px] text-[#2D2D2D] hover:border-[#7C9A82] transition-all duration-200"
                >
                  <span className="max-w-[100px] truncate">{user.fullName}</span>
                  <svg className={`w-4 h-4 text-[#9A9A9A] transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#EBEBEB] py-2 z-20 animate-scale-in">
                      <Link
                        to="/tai-khoan"
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#6B6B6B] hover:text-[#2D2D2D] hover:bg-[#FAFAF8] transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Tài khoản
                      </Link>
                      <Link
                        to="/don-hang"
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#6B6B6B] hover:text-[#2D2D2D] hover:bg-[#FAFAF8] transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Đơn hàng
                      </Link>
                      <Link
                        to="/thong-ke"
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#6B6B6B] hover:text-[#2D2D2D] hover:bg-[#FAFAF8] transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Thống kê
                      </Link>
                      <Link
                        to="/pre-order/cua-toi"
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#6B6B6B] hover:text-[#2D2D2D] hover:bg-[#FAFAF8] transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Pre-order của tôi
                      </Link>
                      <Link
                        to="/yeu-thich"
                        className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#6B6B6B] hover:text-[#2D2D2D] hover:bg-[#FAFAF8] transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Yêu thích
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#6B6B6B] hover:text-[#2D2D2D] hover:bg-[#FAFAF8] transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Quản trị
                        </Link>
                      )}
                      <div className="my-1.5 mx-3 border-t border-[#EBEBEB]" />
                      <button
                        onClick={() => { logout(); setMenuOpen(false) }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-[14px] text-[#C45C4A] hover:bg-[#FEF2F2] transition-colors"
                      >
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/dang-nhap"
                className="px-5 py-2.5 bg-[#2D2D2D] text-white text-[14px] font-medium rounded-full hover:bg-[#1a1a1a] transition-colors duration-200"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-[#2D2D2D]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <nav className="lg:hidden py-6 border-t border-[#EBEBEB] animate-fade-in">
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#EBEBEB] rounded-xl text-[15px] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
            <div className="space-y-1">
              <Link to="/san-pham" className="block py-3 text-[15px] text-[#2D2D2D] hover:text-[#7C9A82] transition-colors" onClick={() => setMenuOpen(false)}>Sản phẩm</Link>
              <Link to="/pre-order" className="block py-3 text-[15px] text-[#2D2D2D] hover:text-[#7C9A82] transition-colors" onClick={() => setMenuOpen(false)}>Pre-Order</Link>
              <Link to="/tin-tuc" className="block py-3 text-[15px] text-[#2D2D2D] hover:text-[#7C9A82] transition-colors" onClick={() => setMenuOpen(false)}>Tin tức</Link>
              <Link to="/gio-hang" className="flex items-center justify-between py-3 text-[15px] text-[#2D2D2D] hover:text-[#7C9A82] transition-colors" onClick={() => setMenuOpen(false)}>
                Giỏ hàng
                {cartCount > 0 && <span className="px-2 py-0.5 bg-[#7C9A82] text-white text-[12px] rounded-full">{cartCount}</span>}
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-[#EBEBEB]">
              {user ? (
                <div className="space-y-1">
                  <Link to="/tai-khoan" className="block py-3 text-[15px] text-[#2D2D2D]" onClick={() => setMenuOpen(false)}>Tài khoản</Link>
                  <Link to="/don-hang" className="block py-3 text-[15px] text-[#2D2D2D]" onClick={() => setMenuOpen(false)}>Đơn hàng</Link>
                  <Link to="/thong-ke" className="block py-3 text-[15px] text-[#2D2D2D]" onClick={() => setMenuOpen(false)}>Thống kê</Link>
                  <Link to="/pre-order/cua-toi" className="block py-3 text-[15px] text-[#2D2D2D]" onClick={() => setMenuOpen(false)}>Pre-order của tôi</Link>
                  <Link to="/yeu-thich" className="block py-3 text-[15px] text-[#2D2D2D]" onClick={() => setMenuOpen(false)}>Yêu thích</Link>
                  <button onClick={() => { logout(); setMenuOpen(false) }} className="block py-3 text-[15px] text-[#C45C4A]">Đăng xuất</button>
                </div>
              ) : (
                <Link to="/dang-nhap" className="block w-full py-3 bg-[#2D2D2D] text-white text-[15px] font-medium text-center rounded-xl" onClick={() => setMenuOpen(false)}>
                  Đăng nhập
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
