// src/pages/AllProducts.jsx
import React, { useState, useMemo } from "react";
import { allProducts } from "/src/data/products";
import { useCart } from "../context/CartContext";
import  toast  from "react-hot-toast";

const AllProducts = () => {
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("latest");

  // === Dữ liệu mô phỏng ===
  const categories = ["All", "Anime-Manga", "Game", "Pokemon", "Sales"];
  const brands = [
    "All",
    "Good Smile Company",
    "Myethos",
    "Riot Games",
    "elCoCo",
    "Kotobukiya",
    "Alter",
  ];

  // === Lọc & sắp xếp sản phẩm ===
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Lọc theo tên
    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Lọc theo danh mục
    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Lọc theo thương hiệu
    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    // Sắp xếp
    if (sort === "price-asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [search, category, brand, sort]);

  return (
    <main className="pt-28 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Danh mục sản phẩm</h3>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`cursor-pointer hover:text-blue-600 ${
                    category === cat ? "text-blue-600 font-medium" : ""
                  }`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Brand</h3>
            <ul className="space-y-1">
              {brands.map((b) => (
                <li
                  key={b}
                  onClick={() => setBrand(b)}
                  className={`cursor-pointer hover:text-blue-600 ${
                    brand === b ? "text-blue-600 font-medium" : ""
                  }`}
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <section className="md:col-span-3">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md px-3 py-2 w-full sm:w-1/2"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="latest">Sort by latest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="border rounded-xl p-3 bg-white shadow hover:shadow-lg transition"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-48 object-contain mb-3"
                  />
                  <h4 className="text-sm font-medium line-clamp-2">{p.name}</h4>
                  <p className="text-red-600 font-bold mb-2">
                    {p.price.toLocaleString("vi-VN")} ₫
                  </p>
                  <button
                    onClick={() => {
                      addToCart({ ...p, quantity: 1 });
                      toast.success("🛒 Đã thêm vào giỏ hàng!");
                    }}
                    className="bg-black text-white w-full py-2 rounded-md hover:bg-gray-800 transition"
                  >
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AllProducts;
