import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "/src/animations/fadeIn.js";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="bg-gray-900 text-gray-300 py-12 px-6 md:px-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + mô tả */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Finguer Toynime</h2>
          <p className="text-sm leading-relaxed">
            Nơi hội tụ của các mô hình anime, manga, và nhân vật yêu thích của bạn.
            Chất lượng - Độc đáo - Đầy cảm hứng ✨
          </p>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Liên kết</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-blue-400 transition">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-blue-400 transition">
                Sản phẩm
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-400 transition">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-400 transition">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        {/* Thông tin liên hệ */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Liên hệ</h3>
          <ul className="space-y-2 text-sm">
            <li>📍 123 Nguyễn Văn Cừ, TP. Hồ Chí Minh</li>
            <li>📞 0909 999 999</li>
            <li>📧 support@finguertoynime.vn</li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Theo dõi chúng tôi</h3>
          <div className="flex items-center space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-gray-800 hover:bg-blue-600 rounded-full transition"
            >
              <FaFacebookF className="text-white text-lg" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-gray-800 hover:bg-pink-600 rounded-full transition"
            >
              <FaInstagram className="text-white text-lg" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-gray-800 hover:bg-gray-500 rounded-full transition"
            >
              <FaTiktok className="text-white text-lg" />
            </a>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Finguer Toynime. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
