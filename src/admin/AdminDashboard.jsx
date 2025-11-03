import React from "react";
import { FaBox, FaShoppingCart, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const stats = [
    { title: "Tổng đơn hàng", value: 120, icon: <FaShoppingCart />, color: "bg-blue-500" },
    { title: "Doanh thu (VNĐ)", value: "45,000,000", icon: <FaMoneyBillWave />, color: "bg-green-500" },
    { title: "Sản phẩm", value: 68, icon: <FaBox />, color: "bg-yellow-500" },
    { title: "Người dùng", value: 530, icon: <FaUsers />, color: "bg-red-500" },
  ];

  const data = [
    { name: "Th1", revenue: 5000000 },
    { name: "Th2", revenue: 8000000 },
    { name: "Th3", revenue: 12000000 },
    { name: "Th4", revenue: 9000000 },
    { name: "Th5", revenue: 15000000 },
    { name: "Th6", revenue: 11000000 },
  ];

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-700">Tổng quan</h2>
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="Admin"
            className="w-10 h-10 rounded-full border"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-5 flex items-center gap-4 hover:shadow-lg transition"
          >
            <div className={`text-white p-3 rounded-full ${item.color} text-xl`}>
              {item.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h3 className="text-xl font-bold">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Doanh thu 6 tháng gần nhất</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
