// src/pages/ProductDetail.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { allProducts } from "/src/data/products.js";
import { useCart } from "../context/CartContext"; // đường dẫn tuỳ cấu trúc của bạn
import { fadeInUp } from "/src/animations/fadeIn.js";
import toast from "react-hot-toast";


const RelatedProducts = ({ productId }) => {
  const related = allProducts.filter((p) => p.id !== productId).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-6 mt-12">
      <h3 className="text-xl font-semibold mb-4">Xem sản phẩm liên quan</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.id}`}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-3 flex flex-col"
          >
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg mb-3">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                onError={(e) => (e.target.src = "/placeholder.png")}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
                {item.name}
              </h4>
              <p className="text-blue-600 font-bold">
                {item.price.toLocaleString("vi-VN")}₫
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find((p) => String(p.id) === String(id));
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(
    product?.image || "/placeholder.png"
  );

  if (!product) {
    return (
      <div className="pt-28 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Sản phẩm không tìm thấy.</p>
          <Link to="/" className="text-blue-500 underline mt-3 block">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const onAddToCart = () => {
    addToCart({ ...product, quantity });
    toast.success("🛒 Đã thêm vào giỏ hàng!");
  };

  return (
    <main className="pt-28">
      <section className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:underline">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:underline">
            Sản phẩm
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left: Gallery */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* Main image */}
            <div className="w-full bg-gray-50 rounded-lg shadow-sm flex items-center justify-center p-6">
              <img
                src={mainImage}
                alt={product.name}
                onError={(e) => (e.target.src = "/placeholder.png")}
                className="w-full h-[420px] md:h-[520px] object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {/* if product.images array exists, map; else use product.image */}
              {(product.images && product.images.length > 0
                ? product.images
                : [product.image]
              ).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img || "/placeholder.png")}
                  className={`w-20 h-20 rounded-lg overflow-hidden border ${
                    mainImage === img
                      ? "ring-2 ring-blue-400"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img || "/placeholder.png"}
                    alt={`${product.name}-${idx}`}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-blue-600">
                {product.price.toLocaleString("vi-VN")}₫
              </span>
            </div>

            <p className="text-gray-600">
              {product.desc || "Mô tả ngắn sản phẩm..."}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value || 1)))
                  }
                  className="w-16 text-center outline-none"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2"
                >
                  +
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onAddToCart();
                    // direct buy: navigate to cart or checkout
                    navigate("/cart");
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Mua ngay
                </button>

                <button
                  onClick={onAddToCart}
                  className="border border-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition"
                >
                  Add to cart
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              <strong>Lưu ý:</strong> Các sản phẩm order/pre-order cần liên hệ
              shop trước khi đặt hàng do giá có thể thay đổi.
            </p>

            {/* Chat quick (dummy) */}
            <button className="w-full md:w-auto bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition">
              Chat nhanh với Shop
            </button>
          </motion.div>
        </div>

        {/* Related products */}
        <RelatedProducts productId={product.id} />
      </section>
    </main>
  );
};

export default ProductDetail;
