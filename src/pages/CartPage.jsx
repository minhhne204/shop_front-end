import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="pt-28 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-3">🛒 Giỏ hàng trống</h2>
        <Link to="/products" className="text-blue-600 underline">
          Tiếp tục mua sắm →
        </Link>
      </div>
    );
  }

  return (
    <main className="pt-28 max-w-6xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-8">🛍️ Giỏ hàng của bạn</h1>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="text-left px-4 py-3">Sản phẩm</th>
              <th className="text-left px-4 py-3">Giá</th>
              <th className="text-left px-4 py-3">Số lượng</th>
              <th className="text-right px-4 py-3">Tổng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-lg border"
                  />
                  <span className="font-medium text-gray-800">{item.name}</span>
                </td>

                {/* ✅ Fix lỗi: nếu price = undefined, hiển thị 0 ₫ */}
                <td className="px-4 py-3">
                  {(item.price ?? 0).toLocaleString("vi-VN")}₫
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center border rounded-md overflow-hidden w-fit">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2 text-gray-600 hover:bg-gray-200"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, Math.max(1, parseInt(e.target.value)))
                      }
                      className="w-12 text-center outline-none border-x"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 text-gray-600 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3 text-right font-semibold">
                  {((item.price ?? 0) * item.quantity).toLocaleString("vi-VN")}₫
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === Tổng tiền & hành động === */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <button
          onClick={clearCart}
          className="text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition"
        >
          Xoá toàn bộ
        </button>

        <div className="text-right">
          <p className="text-lg font-semibold mb-2">
            Tổng cộng:{" "}
            <span className="text-blue-600">
              {(totalPrice ?? 0).toLocaleString("vi-VN")}₫
            </span>
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Thanh toán
          </button>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
