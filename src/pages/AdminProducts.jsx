import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { products } from "../data/products";

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Lấy danh mục duy nhất
  const categories = ["Tất cả", ...new Set(products.map((p) => p.category))];

  // Lọc sản phẩm theo tìm kiếm + danh mục
  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "Tất cả" || p.category === selectedCategory;
    return matchName && matchCategory;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Quản lý sản phẩm
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Ô tìm kiếm */}
          <div className="flex items-center border rounded-lg px-3 py-2 w-full sm:w-72">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              className="outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* ✅ Select danh mục */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Nút thêm sản phẩm */}
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
            <FaPlus /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Hình ảnh</th>
              <th className="py-3 px-4">Tên sản phẩm</th>
              <th className="py-3 px-4">Danh mục</th>
              <th className="py-3 px-4">Giá</th>
              <th className="py-3 px-4">Tình trạng</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition text-gray-700"
              >
                <td className="py-3 px-4">{i + 1}</td>
                <td className="py-3 px-4">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 text-gray-400 flex items-center justify-center rounded-md text-xs">
                      No Img
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">{p.name}</td>
                <td className="py-3 px-4">{p.category}</td>
                <td className="py-3 px-4">{p.price.toLocaleString()} ₫</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.status === "Còn hàng"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button className="text-yellow-500 hover:text-yellow-600 mr-3">
                    <FaEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-600">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
