const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const fetchProducts = async ({ page = 1, limit = 8, category, q } = {}) => {
  const params = new URLSearchParams();
  params.set("_page", page);
  params.set("_limit", limit);
  params.set("_sort", "createdAt");
  params.set("_order", "desc");

  if (category) params.set("categories_like", category);
  if (q) params.set("q", q);

  const res = await fetch(`${BASE_URL}/products?${params.toString()}`);
  const data = await res.json();
  const total = Number(res.headers.get("x-total-count") || data.length);
  return { data, total };
};
