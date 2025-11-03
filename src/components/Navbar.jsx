import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInDown } from "/src/animations/fadeIn.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { totalQuantity } = useCart();

  // ✅ Giả lập login (sau này nối backend)
  const [user, setUser] = useState(null); // null = chưa đăng nhập

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { name: "Anime - Manga", slug: "anime" },
    { name: "Game", slug: "game" },
    { name: "Pokemon", slug: "pokemon" },
    { name: "Scale Figure", slug: "scale-figure" },
    { name: "Nendoroid / Figma", slug: "nendoroid" },
  ];

  const handleCategoryClick = (slug) => {
    navigate(`/products?category=${slug}`);
    setDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(keyword)}`);
      setKeyword("");
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAccountOpen(false);
  };

  return (
    <motion.nav
      initial="hidden"
      animate="show"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        sticky
          ? "bg-white/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
          Finguer <span className="text-blue-500">Toynime</span>
        </Link>

        {/* Menu chính */}
        <ul className="hidden md:flex space-x-10 text-gray-700 font-medium items-center">
          <li>
            <Link
              to="/"
              className={`hover:text-blue-500 transition ${
                location.pathname === "/" ? "text-blue-500" : ""
              }`}
            >
              Trang chủ
            </Link>
          </li>

          {/* Dropdown Sản phẩm */}
          <li
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div
              className={`hover:text-blue-500 transition flex items-center gap-1 cursor-pointer ${
                location.pathname.startsWith("/products") ? "text-blue-500" : ""
              }`}
              onClick={() => navigate("/products")}
            >
              Sản phẩm
              <motion.span
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                className="inline-block text-xs"
              >
                ▼
              </motion.span>
            </div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 px-4"
                >
                  <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                    Danh mục
                  </h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    {categories.map((cat) => (
                      <li
                        key={cat.slug}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="hover:text-blue-600 cursor-pointer transition"
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          <li>
            <Link
              to="/about"
              className={`hover:text-blue-500 transition ${
                location.pathname === "/about" ? "text-blue-500" : ""
              }`}
            >
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`hover:text-blue-500 transition ${
                location.pathname === "/contact" ? "text-blue-500" : ""
              }`}
            >
              Liên hệ
            </Link>
          </li>
          <li>
            <Link
              to="/policy"
              className={`hover:text-blue-500 transition ${
                location.pathname === "/policy" ? "text-blue-500" : ""
              }`}
            >
              Chính sách & Bảo hành
            </Link>
          </li>
        </ul>

        {/* Thanh công cụ bên phải */}
        <div className="flex items-center space-x-4">
          {/* Ô tìm kiếm */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="border rounded-full pl-9 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
            <button type="submit">
              <FaSearch className="absolute left-3 top-2.5 text-gray-500 text-sm" />
            </button>
          </form>

          {/* Giỏ hàng */}
          <Link to="/cart" className="relative text-lg">
            🛒
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Đăng nhập / Tài khoản */}
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="text-gray-700 text-lg hover:text-blue-500 transition"
            >
              <FaUser />
            </button>

            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute right-0 mt-3 bg-white shadow-lg rounded-xl border border-gray-100 py-3 w-44 text-sm"
                >
                  {!user ? (
                    <div className="flex flex-col">
                      <Link
                        to="/login"
                        onClick={() => setAccountOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setAccountOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        Đăng ký
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="px-4 py-2 text-gray-700 font-medium border-b">
                        👋 {user.name}
                      </span>
                      <Link
                        to="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        Tài khoản của tôi
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setAccountOpen(false)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        Đơn hàng
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-left hover:bg-gray-100 text-red-500"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nút mở menu mobile */}
          <button
            className="md:hidden text-gray-800 text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md mt-3 px-6 py-4 space-y-3 rounded-b-2xl"
          >
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="border rounded-full px-3 py-1 text-sm w-full"
              />
            </form>

            <Link to="/" className="block hover:text-blue-500">
              Trang chủ
            </Link>
            <Link to="/products" className="block hover:text-blue-500">
              Sản phẩm
            </Link>
            <div className="ml-3 text-sm text-gray-600 space-y-1">
              {categories.map((cat) => (
                <div
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="cursor-pointer hover:text-blue-500 transition"
                >
                  └ {cat.name}
                </div>
              ))}
            </div>
            <Link to="/about" className="block hover:text-blue-500">
              Giới thiệu
            </Link>
            <Link to="/contact" className="block hover:text-blue-500">
              Liên hệ
            </Link>
            <Link to="/policy" className="block hover:text-blue-500">
              Chính sách & Bảo hành
            </Link>

            {/* Đăng nhập mobile */}
            {!user ? (
              <>
                <Link to="/login" className="block hover:text-blue-500">
                  Đăng nhập
                </Link>
                <Link to="/register" className="block hover:text-blue-500">
                  Đăng ký
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="block hover:text-blue-500">
                  Tài khoản của tôi
                </Link>
                <Link to="/orders" className="block hover:text-blue-500">
                  Đơn hàng
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-left text-red-500"
                >
                  Đăng xuất
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
