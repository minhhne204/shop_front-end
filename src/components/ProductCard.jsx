import React from "react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
    });
    toast.success("🛒 Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden relative">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-64 object-cover"
      />

      {product.badge && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          {product.badge}
        </span>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs mt-1">{product.shortDesc}</p>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-red-600 font-bold">
            {product.price.toLocaleString("vi-VN")} ₫
          </span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-xs">
              {product.oldPrice.toLocaleString("vi-VN")} ₫
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full mt-3 bg-black text-white py-1.5 text-sm rounded hover:bg-gray-800 transition"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
