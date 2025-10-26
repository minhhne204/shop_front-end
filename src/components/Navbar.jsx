import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInDown } from "/src/animations/fadeIn.js";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2); // Giả lập giỏ hàng có 2 sản phẩm

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { totalQuantity } = useCart();

  return (
    <motion.nav
      variants={fadeInDown}
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
        <Link to="/" className="text-2xl font-bold text-gray-900">
          Finguer <span className="text-blue-500">Toynime</span>
        </Link>

        {/* Menu chính */}
        <ul className="hidden md:flex space-x-10 text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-blue-500 transition">
              Trang chủ
            </Link>
          </li>
          <li className="group relative">
            <Link to="/products" className="hover:text-blue-500 transition">
              Sản phẩm
            </Link>
            {/* Dropdown danh mục */}
            <div className="absolute left-0 top-full mt-3 w-[220px] bg-white rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-5">
              <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">
                Danh mục
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  "Anime - Manga",
                  "Game",
                  "Pokemon",
                  "Scale Figure",
                  "Nendoroid / Figma",
                ].map((cat, i) => (
                  <li key={i} className="hover:text-blue-500 cursor-pointer">
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-500 transition">
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-500 transition">
              Liên hệ
            </Link>
          </li>
          <li>
            <Link to="/policy" className="hover:text-blue-500 transition">
              Chính sách & Bảo hành
            </Link>
          </li>
        </ul>

        {/* Thanh công cụ bên phải */}
        <div className="flex items-center space-x-4">
          {/* Ô tìm kiếm */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="border rounded-full pl-9 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-500 text-sm" />
          </div>

          {/* Giỏ hàng */}
          <Link to="/cart" className="relative">
            🛒
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>

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
            <Link to="/" className="block hover:text-blue-500">
              Trang chủ
            </Link>
            <Link to="/products" className="block hover:text-blue-500">
              Sản phẩm
            </Link>
            <Link to="/about" className="block hover:text-blue-500">
              Giới thiệu
            </Link>
            <Link to="/contact" className="block hover:text-blue-500">
              Liên hệ
            </Link>
            <Link to="/policy" className="block hover:text-blue-500">
              Chính sách & Bảo hành
            </Link>
            <div className="flex items-center mt-3 border-t pt-3">
              <FaSearch className="mr-2 text-gray-600" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="flex-1 border rounded-full pl-3 py-1 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
