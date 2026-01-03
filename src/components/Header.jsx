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
    const handleScroll = () => setScrolled(window.scrollY > 20)
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
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
          : 'bg-[#FAFAF8]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-[76px]">

          {/* LOGO */}
          <Link
            to="/"
            className="text-[24px] font-semibold tracking-tight text-[#2D2D2D] hover:text-[#7C9A82] transition-colors"
          >
            Toy<span className="text-[#7C9A82]">Nime</span>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden lg:flex items-center gap-10">
            {['/san-pham', '/pre-order', '/tin-tuc'].map((path, i) => (
              <Link
                key={i}
                to={path}
                className="relative text-[15px] text-[#6B6B6B] hover:text-[#2D2D2D] transition group"
              >
                {path === '/san-pham'
                  ? 'Sản phẩm'
                  : path === '/pre-order'
                  ? 'Pre-Order'
                  : 'Tin tức'}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#7C9A82] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-5">

            {/* SEARCH */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-[210px] focus:w-[280px] transition-all duration-300 pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#E5E5E5] text-[14px] focus:border-[#7C9A82]"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            {/* FAVORITE */}
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

            {/* CART */}
            <Link
              to="/gio-hang"
              className="relative p-2 rounded-full hover:bg-[#F1F4F2] transition"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7C9A82] text-white text-[11px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER */}
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
                className="px-5 py-2.5 rounded-full bg-[#2D2D2D] text-white hover:bg-black transition"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="lg:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}

const MenuLink = ({ to, text, close }) => (
  <Link
    to={to}
    onClick={() => close(false)}
    className="block px-4 py-2.5 text-[14px] text-[#4A4A4A] hover:bg-[#F5F7F6]"
  >
    {text}
  </Link>
)

export default Header
