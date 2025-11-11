import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(data.reverse());
  }, []);

  if (!orders.length)
    return (
      <main className="pt-28 text-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold mb-4">Bạn chưa có đơn hàng nào</h2>
        <p className="text-gray-500">Hãy đặt hàng để bắt đầu mua sắm nhé!</p>
      </main>
    );

  return (
    <main className="pt-28 max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Đơn hàng của tôi</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Đơn #{order.id}</h2>
              <span className="text-sm text-gray-500">{order.createdAt}</span>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Người nhận:</strong> {order.info.name}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {order.info.address}
              </p>
              <p>
                <strong>Thanh toán:</strong>{" "}
                {order.info.payment === "cod"
                  ? "Thanh toán khi nhận hàng"
                  : order.info.payment === "bank"
                  ? "Chuyển khoản ngân hàng"
                  : "Ví MoMo"}
              </p>
            </div>

            <hr className="my-3" />

            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <p>{item.name}</p>
                  <p>
                    {item.price.toLocaleString("vi-VN")}₫ × {item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-right mt-3 font-semibold">
              Tổng: {order.total.toLocaleString("vi-VN")}₫
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Orders;
