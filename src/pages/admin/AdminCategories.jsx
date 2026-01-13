import { useState, useEffect, useRef } from "react";
import api from "../../services/api";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [modal, setModal] = useState({ open: false, mode: "add", data: null });
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [deleteModal, setDeleteModal] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 12);
      if (search) params.append("search", search);

      const res = await api.get(`/categories?${params.toString()}`);

      if (res.data.categories) {
        setCategories(res.data.categories);
        setPagination({
          page: res.data.page || page,
          totalPages: res.data.totalPages || 1,
          total: res.data.total || res.data.categories.length,
        });
      } else {
        setCategories(res.data || []);
        setPagination({
          page: 1,
          totalPages: 1,
          total: res.data?.length || 0,
        });
      }
    } catch (error) {
      console.error(error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(1);
  }, [search]);

  const openAddModal = () => {
    setForm({ name: "", description: "", image: "" });
    setModal({ open: true, mode: "add", data: null });
  };

  const openEditModal = (category) => {
    setForm({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });
    setModal({ open: true, mode: "edit", data: category });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, image: res.data.url });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Tên danh mục
    if (!form.name.trim()) {
      newErrors.name = "Tên danh mục không được để trống";
    } else if (form.name.length < 3) {
      newErrors.name = "Tên danh mục phải ít nhất 3 ký tự";
    } else if (form.name.length > 50) {
      newErrors.name = "Tên danh mục tối đa 50 ký tự";
    }

    // Mô tả
    if (form.description && form.description.length > 200) {
      newErrors.description = "Mô tả tối đa 200 ký tự";
    }

    // Ảnh
    if (!form.image) {
      newErrors.image = "Vui lòng tải lên hình ảnh";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (modal.mode === "add") {
        await api.post("/admin/categories", form);
      } else {
        await api.put(`/admin/categories/${modal.data._id}`, form);
      }
      setModal({ open: false, mode: "add", data: null });
      fetchCategories(pagination.page);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/admin/categories/${deleteModal._id}`);
      setDeleteModal(null);
      fetchCategories(pagination.page);
    } catch (error) {
      console.error(error);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const { page, totalPages } = pagination;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#2D2D2D]">Danh mục</h1>
          <p className="text-[14px] text-[#6B6B6B] mt-1">
            {pagination.total} danh mục
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Thêm danh mục
        </button>
      </div>

      <div className="relative max-w-md">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-[#EBEBEB] rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] focus:border-transparent transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#EBEBEB] hover:border-[#7C9A82] transition-colors"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-14 h-14 rounded-xl object-cover bg-[#F5F5F3]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#F5F5F3] flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[#9A9A9A]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#2D2D2D]">
                    {category.name}
                  </p>
                  {category.description && (
                    <p className="text-[12px] text-[#6B6B6B] mt-0.5 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] hover:bg-[#F5F5F3] rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteModal(category)}
                    className="p-2 text-[#6B6B6B] hover:text-[#C45C4A] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#9A9A9A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-[#6B6B6B]">Chưa có danh mục nào</p>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => fetchCategories(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-lg border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          {getPageNumbers().map((pageNum, idx) => (
            <button
              key={idx}
              onClick={() =>
                typeof pageNum === "number" && fetchCategories(pageNum)
              }
              disabled={pageNum === "..."}
              className={`min-w-[40px] h-10 rounded-lg text-[14px] font-medium transition-colors ${
                pageNum === pagination.page
                  ? "bg-[#7C9A82] text-white"
                  : pageNum === "..."
                  ? "text-[#9A9A9A] cursor-default"
                  : "border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82]"
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => fetchCategories(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 rounded-lg border border-[#EBEBEB] text-[#6B6B6B] hover:border-[#7C9A82] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {modal.open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setModal({ open: false, mode: "add", data: null })}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-5">
              {modal.mode === "add" ? "Thêm danh mục" : "Sửa danh mục"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                />
                {errors.name && (
                  <p className="mt-1 text-[12px] text-[#C45C4A]">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                  Mô tả
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                  Hình ảnh
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {errors.image && (
                  <p className="mt-2 text-[12px] text-[#C45C4A]">
                    {errors.image}
                  </p>
                )}

                {form.image ? (
                  <div className="relative inline-block">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-24 h-24 rounded-xl object-cover bg-[#F5F5F3]"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-[#C45C4A] text-white rounded-full flex items-center justify-center hover:bg-[#a34a3c]"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full py-8 border-2 border-dashed border-[#EBEBEB] rounded-xl hover:border-[#7C9A82] transition-colors"
                  >
                    {uploading ? (
                      <div className="w-6 h-6 mx-auto border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 mx-auto text-[#9A9A9A] mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-[13px] text-[#6B6B6B]">
                          Click để tải ảnh lên
                        </p>
                      </div>
                    )}
                  </button>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setModal({ open: false, mode: "add", data: null })
                  }
                  className="px-5 py-2.5 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
                >
                  {modal.mode === "add" ? "Thêm" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {deleteModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setDeleteModal(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-2">
              Xoá danh mục
            </h3>
            <p className="text-[14px] text-[#6B6B6B] mb-6">
              Bạn có chắc muốn xoá danh mục "{deleteModal.name}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-5 py-2.5 text-[14px] font-medium text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-[#C45C4A] text-white text-[14px] font-medium rounded-xl hover:bg-[#a34a3c] transition-colors"
              >
                Xoá
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCategories;
