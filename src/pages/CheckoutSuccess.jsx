import { Link } from 'react-router-dom'

const CheckoutSuccess = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#EBEBEB] p-8 text-center">
        
        {/* Icon thành công */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#EAF3EE] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#7C9A82]"
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
        </div>

        {/* Tiêu đề */}
        <h1 className="text-[22px] font-semibold text-[#2D2D2D] mb-2">
          Thanh toán thành công 🎉
        </h1>

        {/* Nội dung */}
        <p className="text-[14px] text-[#6B6B6B] mb-6">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được thanh toán thành công
          và đang được xử lý.
        </p>

        {/* Nút quay về sản phẩm */}
        <Link
          to="/san-pham"
          className="inline-block px-6 py-3 bg-[#7C9A82] text-white text-[14px] font-medium rounded-xl hover:bg-[#6B8A71] transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  )
}

export default CheckoutSuccess
