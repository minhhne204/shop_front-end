import React from "react";

const SidebarFilter = ({ onFilterChange, activeCategory, activeBrand }) => {
  const categories = [
    { name: "All", count: 12 },
    { name: "Anime-Manga", count: 2982 },
    { name: "Game", count: 93 },
    { name: "Pokemon", count: 45 },
    { name: "Sales", count: 321 },
  ];

  const brands = [
    "All",
    "Good Smile Company",
    "Myethos",
    "Riot Games",
    "elCoCo",
    "Kotobukiya",
    "Alter",
  ];

  return (
    <aside className="hidden md:block w-1/4 pr-6 border-r">
      <h3 className="font-semibold mb-4">Danh mục sản phẩm</h3>
      <ul className="space-y-2 mb-6">
        {categories.map((cat) => (
          <li
            key={cat.name}
            onClick={() => onFilterChange("category", cat.name)}
            className={`flex justify-between items-center cursor-pointer ${
              activeCategory === cat.name ? "text-blue-500 font-semibold" : "text-gray-700"
            } hover:text-blue-500`}
          >
            <span>{cat.name}</span>
            <span className="text-sm text-gray-400">({cat.count})</span>
          </li>
        ))}
      </ul>

      <h3 className="font-semibold mb-3">Brand</h3>
      <ul className="space-y-2">
        {brands.map((brand) => (
          <li
            key={brand}
            onClick={() => onFilterChange("brand", brand)}
            className={`cursor-pointer ${
              activeBrand === brand ? "text-blue-500 font-semibold" : "text-gray-700"
            } hover:text-blue-500`}
          >
            {brand}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SidebarFilter;
