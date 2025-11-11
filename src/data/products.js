export async function fetchProducts() {
  try {
    const res = await fetch("http://localhost:4001/api/products/get-All");
    if (!res.ok) throw new Error("Không thể tải danh sách sản phẩm!");
    const json = await res.json();
    return json.data || json.products || []; 
  } catch (err) {
    console.error("❌ Lỗi khi tải sản phẩm:", err);
    throw err;
  }
}


export async function fetchProductById(id) {
  try {
    const res = await fetch(`http://localhost:4001/api/products/get-details/${id}`);
    if (!res.ok) throw new Error("Không thể tải chi tiết sản phẩm!");
    const json = await res.json();
    return json.data || json.product || null; 
  } catch (err) {
    console.error(`❌ Lỗi khi tải sản phẩm ID ${id}:`, err);
    throw err;
  }
}


export async function fetchRelatedProducts(currentId) {
  try {
    const all = await fetchProducts();
    return all.filter((p) => p._id !== currentId).slice(0, 4);
  } catch (err) {
    console.error("❌ Lỗi khi tải sản phẩm liên quan:", err);
    return [];
  }
}
