import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const provinces = [
  { name: "Hà Nội", districts: ["Ba Đình", "Đống Đa", "Cầu Giấy", "Thanh Xuân", "Hoàng Mai"] },
  { name: "TP. Hồ Chí Minh", districts: ["Quận 1", "Quận 3", "Quận 7", "Tân Bình", "Bình Thạnh"] },
  { name: "Đà Nẵng", districts: ["Hải Châu", "Sơn Trà", "Thanh Khê", "Liên Chiểu", "Ngũ Hành Sơn"] },
];

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    note: "",
  });

  const [errors, setErrors] = useState({});

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="pt-28 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-3">🛍️ Không có sản phẩm để thanh toán</h2>
        <Link to="/products" className="text-blue-600 underline">
          Mua hàng ngay →
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Khi chọn tỉnh -> cập nhật danh sách quận
    if (name === "province") {
      const selected = provinces.find((p) => p.name === value);
      setSelectedProvince(value);
      setDistricts(selected ? selected.districts : []);
      setForm((prev) => ({ ...prev, province: value, district: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Validate chi tiết
  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên.";
    else if (form.fullName.length < 4)
      newErrors.fullName = "Họ tên phải có ít nhất 4 ký tự.";

    if (!form.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại.";
    else if (!/^0\d{9,10}$/.test(form.phone))
      newErrors.phone = "Số điện thoại không hợp lệ.";

    if (!form.province) newErrors.province = "Vui lòng chọn Tỉnh / Thành phố.";
    if (!form.district) newErrors.district = "Vui lòng chọn Quận / Huyện.";

    if (!form.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ cụ thể.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("📦 Dữ liệu gửi đi:", {
      items: cartItems,
      shippingInfo: form,
      totalPrice,
    });

    alert("🎉 Đặt hàng thành công!");
    clearCart();
  };

  return (
    <main className="pt-28 max-w-6xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-8">💳 Thanh toán</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* ======= CỘT TRÁI: Thông tin sản phẩm ======= */}
        <div className="md:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">🛍️ Thông tin đơn hàng</h2>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    SL: {item.quantity} × {(item.price ?? 0).toLocaleString("vi-VN")}₫
                  </p>
                </div>
                <p className="font-semibold text-blue-600">
                  {((item.price ?? 0) * item.quantity).toLocaleString("vi-VN")}₫
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold">
            <span>Tổng cộng:</span>
            <span className="text-blue-600">
              {totalPrice.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>

        {/* ======= CỘT PHẢI: Thông tin giao hàng ======= */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">🚚 Địa chỉ giao hàng</h2>

          <form onSubmit={handleCheckout} className="space-y-4">
            {/* Họ tên & số điện thoại */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Họ và tên"
                  className="border rounded-lg px-3 py-2 w-full"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Số điện thoại"
                  className="border rounded-lg px-3 py-2 w-full"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Tỉnh / Quận / Phường */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <select
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full"
                >
                  <option value="">-- Chọn Tỉnh / Thành phố --</option>
                  {provinces.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                )}
              </div>

              <div>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  disabled={!selectedProvince}
                  className="border rounded-lg px-3 py-2 w-full disabled:bg-gray-100"
                >
                  <option value="">-- Chọn Quận / Huyện --</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                )}
              </div>

              <input
                name="ward"
                value={form.ward}
                onChange={handleChange}
                type="text"
                placeholder="Phường / Xã (nếu có)"
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>

            {/* Địa chỉ chi tiết */}
            <div>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                type="text"
                placeholder="Số nhà, tên đường..."
                className="border rounded-lg px-3 py-2 w-full"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Ghi chú */}
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Ghi chú (ví dụ: giao giờ hành chính)"
              rows="3"
              className="border rounded-lg px-3 py-2 w-full resize-none"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Xác nhận thanh toán
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
