import { Link } from 'react-router-dom'

const PaymentSuccess = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAFAF8] px-4">
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-8 max-w-md w-full text-center">

        {/* Icon thành công */}
        <div className="w-16 h-16 mx-auto mb-5 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-9 h-9 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-[22px] font-semibold text-[#2D2D2D] mb-2">
          Thanh toán thành công 🎉
        </h1>

        <p className="text-[14px] text-[#6B6B6B] mb-6">
          Đơn hàng của bạn đã được ghi nhận. Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng.
        </p>

        {/* Nút về tất cả sản phẩm */}
        <Link
          to="/products"
          className="block w-full px-6 py-3 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition"
        >
          Tiếp tục mua sắm
        </Link>

        {/* Link phụ */}
        <Link
          to="/"
          className="block mt-4 text-[13px] text-[#7C9A82] hover:underline"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess
