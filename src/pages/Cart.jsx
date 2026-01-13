import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, cartTotal } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "d";
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = itemCount >= 2 ? 0 : 30000;

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 bg-[#F5F5F3] rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[#9A9A9A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h1 className="text-[24px] font-semibold text-[#2D2D2D] mb-3">
          Giỏ hàng
        </h1>
        <p className="text-[15px] text-[#6B6B6B] mb-8">
          Vui lòng đăng nhập để xem giỏ hàng
        </p>
        <Link
          to="/dang-nhap"
          className="inline-block bg-[#2D2D2D] text-white px-8 py-3.5 rounded-xl text-[15px] font-medium hover:bg-[#7C9A82] transition-colors"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (loading) return <Loading />;

  if (cart.items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 bg-[#F5F5F3] rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[#9A9A9A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h1 className="text-[24px] font-semibold text-[#2D2D2D] mb-3">
          Giỏ hàng trống
        </h1>
        <p className="text-[15px] text-[#6B6B6B] mb-8">
          Bạn chưa có sản phẩm nào trong giỏ hàng
        </p>
        <Link
          to="/san-pham"
          className="inline-block bg-[#2D2D2D] text-white px-8 py-3.5 rounded-xl text-[15px] font-medium hover:bg-[#7C9A82] transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-8">
        Giỏ hàng{" "}
        <span className="text-[#6B6B6B] font-normal">
          ({itemCount} sản phẩm)
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
            {cart.items.map((item, index) => {
              const getItemPrice = () => {
                if (item.variantId && item.product?.hasVariants) {
                  const variant = item.product.variants?.find(
                    (v) => v._id === item.variantId
                  );
                  if (variant) {
                    return (
                      variant.salePrice ||
                      variant.price ||
                      item.product.salePrice ||
                      item.product.price
                    );
                  }
                }
                return item.product.salePrice || item.product.price;
              };
              const itemPrice = getItemPrice();

              const getItemStock = () => {
                if (item.variantId && item.product?.hasVariants) {
                  const variant = item.product.variants?.find(
                    (v) => v._id === item.variantId
                  );
                  return variant?.stock ?? 0;
                }
                return item.product.stock ?? 0;
              };

              const itemStock = getItemStock();

              return (
                <div
                  key={`${item.product._id}-${item.variantId || "default"}`}
                  className={`flex gap-5 p-5 ${
                    index !== cart.items.length - 1
                      ? "border-b border-[#EBEBEB]"
                      : ""
                  }`}
                >
                  <Link
                    to={`/san-pham/${item.product.slug}`}
                    className="w-24 h-24 flex-shrink-0 bg-[#F5F5F3] rounded-xl overflow-hidden"
                  >
                    <img
                      src={item.product.images?.[0] || "/placeholder.jpg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/san-pham/${item.product.slug}`}
                      className="text-[15px] font-medium text-[#2D2D2D] hover:text-[#7C9A82] transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    {item.variantName && (
                      <p className="text-[13px] text-[#7C9A82] mt-1">
                        {item.product.variantType || "Phiên bản"}:{" "}
                        {item.variantName}
                      </p>
                    )}
                    <div className="text-[16px] font-semibold text-[#C45C4A] mt-2">
                      {formatPrice(itemPrice)}
                    </div>
                    <p className="text-[13px] text-[#7C9A82] mt-1">
                      {itemStock > 0 ? `Còn ${itemStock} sản phẩm` : "Hết hàng"}
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-[#EBEBEB] rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity - 1,
                              item.variantId
                            )
                          }
                          className="w-9 h-9 flex items-center justify-center text-[#6B6B6B] hover:bg-[#F5F5F3] transition-colors"
                          disabled={item.quantity <= 1}
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
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="w-10 text-center text-[14px] font-medium text-[#2D2D2D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity + 1,
                              item.variantId
                            )
                          }
                          className="w-9 h-9 flex items-center justify-center text-[#6B6B6B] hover:bg-[#F5F5F3] transition-colors"
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
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item.product._id, item.variantId)
                        }
                        className="text-[13px] text-[#C45C4A] hover:text-[#a34a3c] transition-colors"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-[16px] font-semibold text-[#2D2D2D]">
                      {formatPrice(itemPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 sticky top-[100px]">
            <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">
              Tổng đơn hàng
            </h2>
            <div className="space-y-4 text-[14px]">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Tạm tính</span>
                <span className="text-[#2D2D2D] font-medium">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Phí vận chuyển</span>
                <span
                  className={
                    shippingFee === 0
                      ? "text-[#7C9A82] font-medium"
                      : "text-[#2D2D2D]"
                  }
                >
                  {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                </span>
              </div>
              {itemCount < 2 && (
                <div className="bg-[#FEF9E7] text-[#B4956B] text-[13px] px-4 py-3 rounded-xl">
                  Thêm {2 - itemCount} sản phẩm để được miễn phí ship
                </div>
              )}
              <div className="border-t border-[#EBEBEB] pt-4 flex justify-between">
                <span className="text-[16px] font-semibold text-[#2D2D2D]">
                  Tổng cộng
                </span>
                <span className="text-[18px] font-semibold text-[#C45C4A]">
                  {formatPrice(cartTotal + shippingFee)}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/thanh-toan")}
              className="w-full bg-[#2D2D2D] text-white py-4 rounded-xl text-[15px] font-medium hover:bg-[#7C9A82] transition-colors mt-6"
            >
              Tiến hành thanh toán
            </button>
            <Link
              to="/san-pham"
              className="block text-center text-[14px] text-[#7C9A82] hover:text-[#6B8A71] font-medium mt-4 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
