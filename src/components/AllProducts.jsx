import React, { useState, useMemo, useEffect } from "react";
import { fetchProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

const AllProducts = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productsPerPage = 8;

  const categories = [
    "All",
    "Anime",
    "One Piece",
    "Naruto",
    "Attack on Titan",
    "Dragon Ball",
    "Pokemon",
    "Game",
    "Kimetsu No Yaiba",
    "Chainsaw Man",
  ];

  const brands = [
    "All",
    "Good Smile Company",
    "Myethos",
    "Riot Games",
    "Kotobukiya",
    "Alter",
  ];
//fetch dlieu
  useEffect(() => {
  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };
  loadProducts();
}, []);

// lấy dl từ url
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlFilter = searchParams.get("filter");
    const urlSearch = searchParams.get("search");

    if (urlCategory) {
      const matched = categories.find(
        (c) => c.toLowerCase().replace(/\s+/g, "-") === urlCategory
      );
      if (matched) setCategory(matched);
    } else if (urlFilter === "hot") {
      setCategory("Hot");
    } else if (urlFilter === "sale") {
      setCategory("Sale");
    } else {
      setCategory("All");
    }

    if (urlSearch) setSearch(urlSearch);
    setCurrentPage(1);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category === "Hot") {
      filtered = filtered.filter((p) => p.isHot);
    } else if (category === "Sale") {
      filtered = filtered.filter((p) => p.isSale);
    } else if (category !== "All") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, search, category, brand, sort]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const getTitle = () => {
    if (category === "Hot") return "🔥 Sản phẩm nổi bật";
    if (category === "Sale") return "💸 Sản phẩm khuyến mãi";
    if (category !== "All") return `🎌 Danh mục: ${category}`;
    return "Tất cả sản phẩm";
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCurrentPage(1);

    if (cat === "Hot") navigate("/products?filter=hot");
    else if (cat === "Sale") navigate("/products?filter=sale");
    else if (cat === "All") navigate("/products");
    else
      navigate(`/products?category=${cat.toLowerCase().replace(/\s+/g, "-")}`);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="pt-28 pb-24 text-center text-gray-500">
        ⏳ Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <main className="pt-28 pb-24 max-w-7xl mx-auto px-6">
      <div className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">
          Trang chủ
        </Link>{" "}
        / <span className="text-gray-700 font-medium">{getTitle()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2 border-b pb-1">
              Danh mục sản phẩm
            </h3>
            <ul className="space-y-1">
              {["All", "Hot", "Sale", ...categories.slice(1)].map((cat) => (
                <li
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
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
            <h3 className="font-semibold mb-2 border-b pb-1">Thương hiệu</h3>
            <ul className="space-y-1">
              {brands.map((b) => (
                <li
                  key={b}
                  onClick={() => {
                    setBrand(b);
                    setCurrentPage(1);
                  }}
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

        <section className="md:col-span-3">
          <h2 className="text-2xl font-semibold mb-4">{getTitle()}</h2>

        
          <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
            <input
              type="text"
              placeholder="🔍 Tìm sản phẩm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-md px-3 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
            >
              <option value="latest">🕒 Mới nhất</option>
              <option value="price-asc">💰 Giá: Thấp → Cao</option>
              <option value="price-desc">💸 Giá: Cao → Thấp</option>
            </select>
          </div>

          
          {currentProducts.length === 0 ? (
            <p className="text-gray-500 italic">
              Không tìm thấy sản phẩm phù hợp.
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {currentProducts.map((p) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="border rounded-xl p-3 bg-white shadow hover:shadow-lg transition"
                  >
                    <Link to={`/product/${p._id}`}>
                      <img
                        src={
                          p.image ||
                          "https://via.placeholder.com/300x300?text=No+Image"
                        }
                        alt={p.name}
                        className="w-full h-48 object-contain mb-3"
                      />
                      <h4 className="text-sm font-medium line-clamp-2 hover:text-blue-600">
                        {p.name}
                      </h4>
                    </Link>

                    <p className="text-red-600 font-bold mb-2">
                      {p.price?.toLocaleString("vi-VN")} ₫
                    </p>
                    <button
                      onClick={() => {
                        addToCart({ ...p, quantity: 1 });
                        toast.success("🛒 Đã thêm vào giỏ hàng!");
                      }}
                      className="bg-black text-white w-full py-2 rounded-md hover:bg-gray-800 transition"
                    >
                      Thêm vào giỏ
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-4 py-2 rounded-md border ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                ← Trước
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-4 py-2 rounded-md border ${
                    currentPage === idx + 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-4 py-2 rounded-md border ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                Sau →
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AllProducts;
