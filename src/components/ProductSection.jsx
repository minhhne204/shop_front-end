import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/fadeIn.js";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import useProducts from "../hooks/useProducts.js";

const fallbackImage = "https://via.placeholder.com/300x300?text=No+Image";

const ProductSection = () => {
  const { products, loading } = useProducts();

  const hotProducts = products.filter((item) => item.tags?.includes("hot"));
  const saleProducts = products.filter((item) => item.tags?.includes("sale"));

  if (loading)
    return (
      <div className="py-20 text-center text-gray-500">
        ⏳ Đang tải sản phẩm...
      </div>
    );

  return (
    <div className="px-6 md:px-16 py-12 space-y-16 font-rajdhani">
      {/* === TẤT CẢ SẢN PHẨM === */}
      <section>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <div className="flex items-center space-x-2">
            <FaBars className="text-xl text-gray-700" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              🛍️ Tất cả sản phẩm
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm md:text-base font-medium text-gray-800 hover:text-blue-500 transition"
          >
            Xem tất cả &rarr;
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((item, index) => (
              <Link key={item._id} to={`/product/${item._id}`}>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-4 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition"
                >
                  <img
                    src={item.image || fallbackImage}
                    alt={item.name}
                    className="w-full h-48 object-contain mb-3"
                  />
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-blue-600 font-bold">
                    {item.price?.toLocaleString("vi-VN")}₫
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* === SẢN PHẨM HOT === */}
      <section>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            🔥 Sản phẩm hot
          </h2>
          <Link
            to="/products?filter=hot"
            className="text-sm md:text-base font-medium text-gray-800 hover:text-blue-500 transition"
          >
            Xem tất cả &rarr;
          </Link>
        </div>

        {hotProducts.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có sản phẩm hot nào.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {hotProducts.slice(0, 8).map((item, index) => (
              <Link key={item._id} to={`/product/${item._id}`}>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-4 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition"
                >
                  <img
                    src={item.image || fallbackImage}
                    alt={item.name}
                    className="w-full h-48 object-contain mb-3"
                  />
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-blue-600 font-bold">
                    {item.price?.toLocaleString("vi-VN")}₫
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* === SẢN PHẨM GIẢM GIÁ === */}
      <section>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            💸 Sản phẩm giảm giá
          </h2>
          <Link
            to="/products?filter=sale"
            className="text-sm md:text-base font-medium text-gray-800 hover:text-blue-500 transition"
          >
            Xem tất cả &rarr;
          </Link>
        </div>

        {saleProducts.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có sản phẩm giảm giá nào.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {saleProducts.slice(0, 8).map((item, index) => (
              <Link key={item._id} to={`/product/${item._id}`}>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-4 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition"
                >
                  <img
                    src={item.image || fallbackImage}
                    alt={item.name}
                    className="w-full h-48 object-contain mb-3"
                  />
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-blue-600 font-bold">
                      {item.price?.toLocaleString("vi-VN")}₫
                    </p>
                    {item.oldPrice && (
                      <p className="text-gray-400 line-through text-sm">
                        {item.oldPrice.toLocaleString("vi-VN")}₫
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-red-500 font-semibold">
                    Giảm giá!
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductSection;
