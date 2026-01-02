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
                className="relative p-2 rounded-full hover:bg-[#F1F4F2] transition"
              >
                ❤️
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
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E5E5] hover:border-[#7C9A82] transition"
                >
                  <span className="max-w-[90px] truncate text-[14px]">
                    {user.fullName}
                  </span>
                  ⌄
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border z-20 overflow-hidden animate-scale-in">
                      <MenuLink to="/tai-khoan" text="Tài khoản" close={setMenuOpen} />
                      <MenuLink to="/don-hang" text="Đơn hàng" close={setMenuOpen} />
                      <MenuLink to="/thong-ke" text="Thống kê" close={setMenuOpen} />
                      <MenuLink to="/yeu-thich" text="Yêu thích" close={setMenuOpen} />
                      {user.role === 'admin' && (
                        <MenuLink to="/admin" text="Quản trị" close={setMenuOpen} />
                      )}
                      <div className="border-t my-1" />
                      <button
                        onClick={() => {
                          logout()
                          setMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2.5 text-[#C45C4A] hover:bg-[#FEF2F2]"
                      >
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
