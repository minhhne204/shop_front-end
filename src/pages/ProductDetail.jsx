// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "/src/data/products.js";
import { useCart } from "../context/CartContext";
import { fadeInUp } from "/src/animations/fadeIn.js";
import toast from "react-hot-toast";

// === Skeleton Component === //
const Skeleton = () => (
  <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10 p-6">
    <div className="bg-gray-200 h-[520px] rounded-xl"></div>
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-2/3"></div>
      <div className="h-12 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

// === Rating Stars Component === //
const RatingStars = ({ rating, reviews }) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(5)].map((_, i) => {
          if (i < filledStars)
            return <span key={i} className="text-yellow-400 text-lg">★</span>;
          if (i === filledStars && hasHalfStar)
            return <span key={i} className="text-yellow-400 text-lg">☆</span>;
          return <span key={i} className="text-gray-300 text-lg">★</span>;
        })}
      </div>
      <span className="text-sm text-gray-600">
        {rating.toFixed(1)} ({reviews} đánh giá)
      </span>
    </div>
  );
};

// === Related Products === //
const RelatedProducts = ({ productId }) => {
  const related = products.filter((p) => p.id !== productId).slice(0, 4);
  return (
    <section className="max-w-7xl mx-auto px-6 mt-16">
      <h3 className="text-2xl font-semibold mb-6 text-gray-900">
        Sản phẩm liên quan
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((item) => (
          <Link
            key={item.id}
            to={`/product/${item.id}`}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col group"
          >
            <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden rounded-lg mb-3">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                onError={(e) => (e.target.src = "/placeholder.png")}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h4 className="text-base font-medium text-gray-800 line-clamp-2 mb-1">
              {item.name}
            </h4>
            <p className="text-blue-600 font-bold text-lg">
              {item.price.toLocaleString("vi-VN")}₫
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

// === MAIN COMPONENT === //
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("/placeholder.png");

  // Fake loading to show skeleton effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const found = products.find((p) => String(p.id) === String(id));
      setProduct(found);
      setMainImage(found?.image || "/placeholder.png");
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <Skeleton />;

  if (!product) {
    return (
      <div className="pt-28 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">❌ Sản phẩm không tìm thấy.</p>
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
          <Link to="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:underline">Sản phẩm</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Gallery */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <div className="w-full bg-gray-50 rounded-xl shadow-sm flex items-center justify-center p-6">
              <img
                src={mainImage}
                alt={product.name}
                onError={(e) => (e.target.src = "/placeholder.png")}
                className="w-full h-[420px] md:h-[520px] object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 justify-center md:justify-start">
              {(product.images && product.images.length > 0
                ? product.images
                : [product.image]
              ).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img || "/placeholder.png")}
                  className={`w-20 h-20 rounded-lg overflow-hidden border transition ${
                    mainImage === img
                      ? "ring-2 ring-blue-400"
                      : "border-gray-200 hover:border-blue-400"
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

          {/* Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating Stars */}
            <RatingStars rating={product.rating || 4.5} reviews={product.reviews || 32} />

            <p className="text-3xl font-extrabold text-blue-600">
              {product.price.toLocaleString("vi-VN")}₫
            </p>

            <p className="text-gray-600 leading-relaxed">
              {product.desc || "Mô tả ngắn sản phẩm đang cập nhật..."}
            </p>

            {/* Quantity + Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-lg"
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
                  className="px-3 py-2 text-lg"
                >
                  +
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onAddToCart();
                    navigate("/cart");
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Mua ngay
                </button>

                <button
                  onClick={onAddToCart}
                  className="border border-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              <strong>Lưu ý:</strong> Các sản phẩm order có thể thay đổi giá. Vui lòng liên hệ shop trước khi đặt hàng.
            </p>

            <button className="mt-3 bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition">
              💬 Chat nhanh với Shop
            </button>
          </motion.div>
        </div>

        <RelatedProducts productId={product.id} />
      </section>
    </main>
  );
};

export default ProductDetail;
