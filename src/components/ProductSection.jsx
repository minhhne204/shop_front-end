import React from "react";
import { motion } from "framer-motion";
import { allProducts, hotProducts, saleProducts } from "/src/data/products.js";
import { fadeInUp } from "../animations/fadeIn.js";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const ProductSection = () => {
  return (
    <div className="px-6 md:px-16 py-12 space-y-16">
      {/* === TẤT CẢ SẢN PHẨM === */}
      <section>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          {/* Bên trái */}
          <div className="flex items-center space-x-2">
            <FaBars className="text-xl text-gray-700" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              All Products
            </h2>
          </div>

          {/* Bên phải */}
          <Link
            to="/products"
            className="text-sm md:text-base font-medium text-gray-800 hover:text-blue-500 transition"
          >
            Xem tất cả &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {allProducts.map((item, index) => (
            <Link
              key={item.id} // ✅ Đặt key ở đây
              to={`/product/${item.id}`}
            >
              <motion.div
                key={item.id}
                variants={fadeInUp}
                initial="hidden"
                animate="show"
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-contain mb-3"
                />
                <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-blue-600 font-bold">
                  {item.price.toLocaleString("vi-VN")}₫
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* === SẢN PHẨM HOT === */}
      <section>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
           <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🔥 Sản phẩm hot
        </h2> 
        <Link
            to="/products"
            className="text-sm md:text-base font-medium text-gray-800 hover:text-blue-500 transition"
          >
            Xem tất cả &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {hotProducts.map((item, index) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-contain mb-3"
              />
              <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                {item.name}
              </h3>
              <p className="text-blue-600 font-bold">
                {item.price.toLocaleString("vi-VN")}₫
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === SẢN PHẨM GIẢM GIÁ === */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          💸 Sản phẩm giảm giá
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {saleProducts.map((item, index) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-contain mb-3"
              />
              <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                {item.name}
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-blue-600 font-bold">
                  {item.price.toLocaleString("vi-VN")}₫
                </p>
                <p className="text-gray-400 line-through text-sm">
                  {item.oldPrice.toLocaleString("vi-VN")}₫
                </p>
              </div>
              <span className="text-xs text-red-500 font-semibold">
                Giảm giá!
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductSection;
