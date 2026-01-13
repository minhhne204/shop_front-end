import { useState, useEffect } from "react";
import api from "../../services/api";

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState({ open: false, mode: "add", data: null });
  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const [deleteModal, setDeleteModal] = useState(null);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/promotions");
      let data = res.data.promotions || res.data || [];

      if (search) {
        data = data.filter(
          (p) =>
            p.code?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (statusFilter === "active") {
        data = data.filter((p) => p.isActive);
      } else if (statusFilter === "inactive") {
        data = data.filter((p) => !p.isActive);
      }

      setPromotions(data);
    } catch (error) {
      console.error(error);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [search, statusFilter]);

  const openAddModal = () => {
    setForm({
      code: "",
      description: "",
      type: "percentage",
      value: "",
      minOrder: "",
      maxDiscount: "",
      usageLimit: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setModal({ open: true, mode: "add", data: null });
    setErrors({});
  };

  const openEditModal = (promo) => {
    setForm({
      code: promo.code || "",
      description: promo.description || "",
      type: promo.discountType === "percent" ? "percentage" : "fixed",
      value: promo.discountValue || "",
      minOrder: promo.minOrder || "",
      maxDiscount: promo.maxDiscount || "",
      usageLimit: promo.usageLimit || "",
      startDate: promo.startDate ? promo.startDate.split("T")[0] : "",
      endDate: promo.endDate ? promo.endDate.split("T")[0] : "",
      isActive: promo.isActive !== false,
    });
    setModal({ open: true, mode: "edit", data: promo });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    // Code
    if (!form.code.trim()) {
      newErrors.code = "Vui lòng nhập mã giảm giá";
    } else if (!/^[A-Z0-9]{4,}$/.test(form.code)) {
      newErrors.code = "Mã phải ≥ 4 ký tự, không dấu, không khoảng trắng";
    }

    // Giá trị giảm
    if (!form.value || Number(form.value) <= 0) {
      newErrors.value = "Giá trị giảm phải lớn hơn 0";
    } else {
      if (form.type === "percentage" && Number(form.value) > 100) {
        newErrors.value = "Giảm phần trăm không được quá 100%";
      }
      if (form.type === "fixed" && Number(form.value) < 1000) {
        newErrors.value = "Giảm tiền tối thiểu 1.000đ";
      }
    }

    // Min order
    if (form.minOrder && Number(form.minOrder) < 0) {
      newErrors.minOrder = "Đơn tối thiểu không hợp lệ";
    }

    // Max discount
    if (form.maxDiscount && Number(form.maxDiscount) < 0) {
      newErrors.maxDiscount = "Giảm tối đa không hợp lệ";
    }

    // Usage limit
    if (form.usageLimit && Number(form.usageLimit) < 0) {
      newErrors.usageLimit = "Số lượt dùng không hợp lệ";
    }

    // Date
    if (!form.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!form.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    } else if (form.startDate && form.endDate < form.startDate) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = {
        code: form.code,
        discountType: form.type === "percentage" ? "percent" : "fixed",
        discountValue: Number(form.value),
        minOrder: form.minOrder ? Number(form.minOrder) : 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive,
      };

      if (modal.mode === "add") {
        await api.post("/admin/promotions", data);
      } else {
        await api.put(`/admin/promotions/${modal.data._id}`, data);
      }

      setModal({ open: false, mode: "add", data: null });
      setErrors({});
      fetchPromotions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/admin/promotions/${deleteModal._id}`);
      setDeleteModal(null);
      fetchPromotions();
    } catch (error) {
      console.error(error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#2D2D2D]">
            Khuyến mãi
          </h1>
          <p className="text-[14px] text-[#6B6B6B] mt-1">
            {promotions.length} mã giảm giá
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
          Thêm mã
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
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
            placeholder="Tìm kiếm mã giảm giá..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#EBEBEB] rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: "all", label: "Tất cả" },
            { value: "active", label: "Hoạt động" },
            { value: "inactive", label: "Tắt" },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`px-4 py-2.5 text-[13px] font-medium rounded-xl transition-colors ${
                statusFilter === status.value
                  ? "bg-[#7C9A82] text-white"
                  : "bg-white text-[#6B6B6B] border border-[#EBEBEB] hover:border-[#7C9A82]"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EBEBEB]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : promotions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EBEBEB]">
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">
                    Mã
                  </th>
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">
                    Giảm giá
                  </th>
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">
                    Thời hạn
                  </th>
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">
                    Đã dùng
                  </th>
                  <th className="text-left px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">
                    Trạng thái
                  </th>
                  <th className="text-right px-5 py-4 text-[13px] font-medium text-[#6B6B6B]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr
                    key={promo._id}
                    className="border-b border-[#EBEBEB] last:border-0 hover:bg-[#FAFAF8]"
                  >
                    <td className="px-5 py-4">
                      <p className="text-[14px] font-mono font-medium text-[#7C9A82]">
                        {promo.code}
                      </p>
                      {promo.description && (
                        <p className="text-[12px] text-[#6B6B6B] mt-0.5">
                          {promo.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[14px] font-medium text-[#2D2D2D]">
                        {promo.discountType === "percent"
                          ? `${promo.discountValue}%`
                          : formatCurrency(promo.discountValue)}
                      </p>
                      {promo.minOrder > 0 && (
                        <p className="text-[12px] text-[#6B6B6B] mt-0.5">
                          Từ {formatCurrency(promo.minOrder)}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[14px] text-[#2D2D2D]">
                        {promo.startDate && formatDate(promo.startDate)}
                        {promo.endDate && ` - ${formatDate(promo.endDate)}`}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[14px] text-[#6B6B6B]">
                        {promo.usedCount || 0}
                        {promo.usageLimit && ` / ${promo.usageLimit}`}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {promo.isActive ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[12px] font-medium rounded-lg">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[12px] font-medium rounded-lg">
                          Tắt
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(promo)}
                          className="p-2 text-[#6B6B6B] hover:text-[#7C9A82] hover:bg-[#F5F5F3] rounded-lg transition-colors"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteModal(promo)}
                          className="p-2 text-[#6B6B6B] hover:text-[#C45C4A] hover:bg-[#FEF2F2] rounded-lg transition-colors"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
            <p className="text-[#6B6B6B]">Chưa có mã khuyến mãi nào</p>
          </div>
        )}
      </div>

      {modal.open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setModal({ open: false, mode: "add", data: null })}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl p-6 z-50 max-h-[90vh] overflow-y-auto">
            <h3 className="text-[18px] font-semibold text-[#2D2D2D] mb-5">
              {modal.mode === "add"
                ? "Thêm mã khuyến mãi"
                : "Sửa mã khuyến mãi"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                    Mã giảm giá
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] font-mono focus:ring-2 focus:ring-[#7C9A82] transition-all"
                    placeholder="SUMMER2024"
                    
                  />
                  {errors.code && (
                    <p className="text-red-500 text-[12px] mt-1">
                      {errors.code}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                    Loại giảm
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                  Mô tả
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                  placeholder="Giảm 10% cho đơn từ 500k"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                    Giá trị {form.type === "percentage" ? "(%)" : "(VNĐ)"}
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) =>
                      setForm({ ...form, value: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                    
                  />
                  {errors.value && (
                    <p className="text-red-500 text-[12px] mt-1">
                      {errors.value}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                    Đơn tối thiểu
                  </label>
                  <input
                    type="number"
                    value={form.minOrder}
                    onChange={(e) =>
                      setForm({ ...form, minOrder: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                    placeholder="0"
                  />
                  {errors.minOrder && (
                    <p className="text-red-500 text-[12px] mt-1">
                      {errors.minOrder}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                    Giảm tối đa
                  </label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) =>
                      setForm({ ...form, maxDiscount: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                    placeholder="Không giới hạn"
                  />
                  {errors.maxDiscount && (
                    <p className="text-red-500 text-[12px] mt-1">
                      {errors.maxDiscount}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                    Số lượt dùng
                  </label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) =>
                      setForm({ ...form, usageLimit: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                    placeholder="Không giới hạn"
                  />
                  {errors.usageLimit && (
                    <p className="text-red-500 text-[12px] mt-1">
                      {errors.usageLimit}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                    
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-[12px] mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#F5F5F3] border-0 rounded-xl text-[14px] focus:ring-2 focus:ring-[#7C9A82] transition-all"
                    
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-[12px] mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#7C9A82] focus:ring-[#7C9A82]"
                />
                <label
                  htmlFor="isActive"
                  className="text-[14px] text-[#2D2D2D]"
                >
                  Kích hoạt mã
                </label>
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
              Xoá mã khuyến mãi
            </h3>
            <p className="text-[14px] text-[#6B6B6B] mb-6">
              Bạn có chắc muốn xoá mã "{deleteModal.code}"?
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

export default AdminPromotions;
