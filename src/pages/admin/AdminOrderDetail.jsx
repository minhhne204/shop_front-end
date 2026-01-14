import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/admin/orders/${id}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value || 0) + "đ";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statuses = [
    {
      value: "pending",
      label: "Chờ xử lý",
      color: "bg-yellow-100 text-yellow-700",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      value: "confirmed",
      label: "Đã xác nhận",
      color: "bg-blue-100 text-blue-700",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      value: "shipping",
      label: "Đang giao",
      color: "bg-purple-100 text-purple-700",
      icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
    },
    {
      value: "delivered",
      label: "Đã giao",
      color: "bg-green-100 text-green-700",
      icon: "M5 13l4 4L19 7",
    },
    {
      value: "cancelled",
      label: "Đã huỷ",
      color: "bg-red-100 text-red-700",
      icon: "M6 18L18 6M6 6l12 12",
    },
  ];

  const getStatusInfo = (status) => {
    return statuses.find((s) => s.value === status) || statuses[0];
  };

  const getStatusIndex = (status) => {
    return statuses.findIndex((s) => s.value === status);
  };

  const getPaymentStatusText = (status) => {
    const statuses = {
      pending: { text: "Chờ thanh toán", color: "text-[#B4956B]" },
      paid: { text: "Đã thanh toán", color: "text-[#7C9A82]" },
      failed: { text: "Thanh toán thất bại", color: "text-[#C45C4A]" },
    };
    return statuses[status] || { text: status, color: "text-[#6B6B6B]" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-[#6B6B6B]">Không tìm thấy đơn hàng</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const currentStatusIndex = getStatusIndex(order.status);
  const subtotal =
    order.items?.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    ) || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/don-hang")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F5F5F3] text-[#6B6B6B] hover:bg-[#EBEBEB] transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-[24px] font-semibold text-[#2D2D2D]">
              #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-[14px] text-[#6B6B6B]">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={`px-4 py-2 rounded-xl text-[14px] font-medium ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      {order.status !== "cancelled" && (
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
          <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-6">
            Tiến trình đơn hàng
          </h2>
          <div className="flex items-center justify-between">
            {statuses
              .filter((s) => {
                // Ẩn "Đã huỷ" nếu đã xác nhận trở lên
                if (
                  order.status === "confirmed" ||
                  order.status === "shipping" ||
                  order.status === "delivered"
                ) {
                  return s.value !== "cancelled";
                }
                return s.value !== "";
              })
              .filter(
                (s) => s.value !== "cancelled" || order.status === "pending"
              )
              .map((status, index) => {
                const filteredStatuses = statuses
                  .filter((s) => {
                    if (
                      order.status === "confirmed" ||
                      order.status === "shipping" ||
                      order.status === "delivered"
                    ) {
                      return s.value !== "cancelled";
                    }
                    return s.value !== "";
                  })
                  .filter(
                    (s) => s.value !== "cancelled" || order.status === "pending"
                  );
                const isActive =
                  index <=
                  filteredStatuses.findIndex((s) => s.value === order.status);
                const isCurrent =
                  index ===
                  filteredStatuses.findIndex((s) => s.value === order.status);
                return (
                  <div
                    key={status.value}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="relative w-full flex items-center justify-center">
                      {index > 0 && (
                        <div
                          className={`absolute left-0 right-1/2 h-1 top-1/2 -translate-y-1/2 ${
                            isActive ? "bg-[#7C9A82]" : "bg-[#EBEBEB]"
                          }`}
                        />
                      )}
                      {index < filteredStatuses.length - 1 && (
                        <div
                          className={`absolute left-1/2 right-0 h-1 top-1/2 -translate-y-1/2 ${
                            index <
                            filteredStatuses.findIndex(
                              (s) => s.value === order.status
                            )
                              ? "bg-[#7C9A82]"
                              : "bg-[#EBEBEB]"
                          }`}
                        />
                      )}
                      <div
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                          isActive
                            ? "bg-[#7C9A82] text-white"
                            : "bg-[#F5F5F3] text-[#9A9A9A]"
                        } ${isCurrent ? "ring-4 ring-[#7C9A82]/20" : ""}`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d={status.icon}
                          />
                        </svg>
                      </div>
                    </div>
                    <p
                      className={`text-[12px] mt-3 font-medium ${
                        isActive ? "text-[#2D2D2D]" : "text-[#9A9A9A]"
                      }`}
                    >
                      {status.label}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] font-semibold text-[#2D2D2D]">
                Sản phẩm ({order.items?.length || 0})
              </h2>
            </div>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-[#FAFAF8] rounded-xl"
                >
                  <img
                    src={
                      item.image ||
                      item.product?.images?.[0] ||
                      "/placeholder.png"
                    }
                    alt={item.name || item.product?.name}
                    className="w-20 h-20 rounded-xl object-cover bg-[#F5F5F3]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium text-[#2D2D2D] line-clamp-2">
                      {item.name || item.product?.name || "Sản phẩm"}
                    </p>
                    {item.variantName && (
                      <p className="text-[12px] text-[#7C9A82] mt-1">
                        Phiên bản: {item.variantName}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[13px] text-[#6B6B6B]">
                        Đơn giá: {formatCurrency(item.price)}
                      </span>
                      <span className="text-[13px] text-[#6B6B6B]">
                        SL: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[15px] font-semibold text-[#2D2D2D]">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#EBEBEB]">
              <div className="space-y-3">
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#6B6B6B]">Tạm tính</span>
                  <span className="text-[#2D2D2D]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#6B6B6B]">Phí vận chuyển</span>
                  <span
                    className={
                      order.shippingFee === 0
                        ? "text-[#7C9A82]"
                        : "text-[#2D2D2D]"
                    }
                  >
                    {order.shippingFee === 0
                      ? "Miễn phí"
                      : formatCurrency(order.shippingFee)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[14px]">
                    <span className="text-[#6B6B6B]">Giảm giá</span>
                    <span className="text-[#7C9A82]">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-[#EBEBEB]">
                  <span className="text-[16px] font-semibold text-[#2D2D2D]">
                    Tổng cộng
                  </span>
                  <span className="text-[18px] font-semibold text-[#C45C4A]">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">
                Cập nhật trạng thái
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {statuses
                  .filter((s) => {
                    // Ẩn "Đã huỷ" nếu đã xác nhận trở lên
                    if (
                      order.status === "confirmed" ||
                      order.status === "shipping" ||
                      order.status === "delivered"
                    ) {
                      return s.value !== "cancelled";
                    }
                    return s.value !== "";
                  })
                  .map((status) => {
                    const statusIndex = getStatusIndex(status.value);
                    const isEarlier = statusIndex < currentStatusIndex;
                    return (
                      <button
                        key={status.value}
                        onClick={() => handleUpdateStatus(status.value)}
                        disabled={
                          updating || order.status === status.value || isEarlier
                        }
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                          order.status === status.value
                            ? `${status.color} ring-2 ring-offset-2`
                            : "bg-[#F5F5F3] text-[#6B6B6B] hover:bg-[#EBEBEB]"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                            d={status.icon}
                          />
                        </svg>
                        <span className="text-[12px] font-medium">
                          {status.label}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#7C9A82] flex items-center justify-center text-white text-[14px] font-medium">
                {order.shippingAddress?.fullName?.charAt(0)?.toUpperCase() ||
                  "K"}
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-[#2D2D2D]">
                  {order.shippingAddress?.fullName}
                </h2>
                <p className="text-[13px] text-[#6B6B6B]">Khách hàng</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F5F5F3] flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#6B6B6B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] text-[#9A9A9A]">Số điện thoại</p>
                  <p className="text-[14px] text-[#2D2D2D]">
                    {order.shippingAddress?.phone || "Chưa có"}
                  </p>
                </div>
              </div>
              {(order.shippingAddress?.email || order.user?.email) && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F5F3] flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#6B6B6B]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#9A9A9A]">Email</p>
                    <p className="text-[14px] text-[#2D2D2D]">
                      {order.shippingAddress?.email || order.user?.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-[#7C9A82]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h2 className="text-[15px] font-semibold text-[#2D2D2D]">
                Địa chỉ giao hàng
              </h2>
            </div>
            <p className="text-[14px] text-[#2D2D2D] leading-relaxed">
              {[
                order.shippingAddress?.street,
                order.shippingAddress?.ward,
                order.shippingAddress?.district,
                order.shippingAddress?.city,
              ]
                .filter(Boolean)
                .join(", ") || "Chưa có địa chỉ"}
            </p>
          </div>

          {order.paymentMethod === "vnpay" && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-[#7C9A82]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h2 className="text-[15px] font-semibold text-[#2D2D2D]">
                    Trạng thái thanh toán
                  </h2>
                </div>
                <p
                  className={`text-[14px] text-[#6B6B6B] bg-[#F5F5F3] p-4 rounded-xl font-medium mt-1 ${
                    getPaymentStatusText(order.paymentStatus).color
                  }`}
                >
                  {getPaymentStatusText(order.paymentStatus).text}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-[#7C9A82]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <h2 className="text-[15px] font-semibold text-[#2D2D2D]">
                Thanh toán
              </h2>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#F5F5F3] rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                {order.paymentMethod === "cod" ? (
                  <svg
                    className="w-5 h-5 text-[#7C9A82]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-[#7C9A82]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#2D2D2D]">
                  {order.paymentMethod === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : "Chuyển khoản ngân hàng"}
                </p>
                <p className="text-[12px] text-[#6B6B6B]">
                  {order.paymentMethod === "cod" ? "COD" : "Banking"}
                </p>
              </div>
            </div>
          </div>

          {order.note && (
            <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-[#7C9A82]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <h2 className="text-[15px] font-semibold text-[#2D2D2D]">
                  Ghi chú
                </h2>
              </div>
              <p className="text-[14px] text-[#6B6B6B] bg-[#F5F5F3] p-4 rounded-xl">
                {order.note}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
