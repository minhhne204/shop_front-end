import { useEffect, useState } from "react";
import { fetchProducts } from "../data/products";
import toast from "react-hot-toast";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        toast.error("Không thể tải sản phẩm từ server!");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { products, loading };
}
