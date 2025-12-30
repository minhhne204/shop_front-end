import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import api from '../services/api'

const VNPayReturn = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries())
        const res = await api.get('/vnpay/vnpay-return', { params })
        setResult(res.data)
      } catch (error) {
        setResult({
          success: false,
          message: 'Có lỗi xảy ra khi xác thực thanh toán'
        })
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B6B6B]">Đang xác thực thanh toán...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#EBEBEB] p-8 text-center">
        {result?.success ? (
          <>
            <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[24px] font-semibold text-[#2D2D2D] mb-3">Thanh toán thành công</h1>
            <p className="text-[#6B6B6B] mb-6">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được thanh toán thành công qua VNPay.
            </p>
            <div className="space-y-3">
              <Link
                to={`/don-hang/${result.orderId}`}
                className="block w-full bg-[#7C9A82] text-white py-3 rounded-xl text-[15px] font-medium hover:bg-[#6B8A71] transition-colors"
              >
                Xem chi tiết đơn hàng
              </Link>
              <Link
                to="/"
                className="block w-full bg-[#F5F5F3] text-[#2D2D2D] py-3 rounded-xl text-[15px] font-medium hover:bg-[#EBEBEB] transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#C45C4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-[24px] font-semibold text-[#2D2D2D] mb-3">Thanh toán thất bại</h1>
            <p className="text-[#6B6B6B] mb-6">
              {result?.message || 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'}
            </p>
            <div className="space-y-3">
              {result?.orderId && (
                <Link
                  to={`/don-hang/${result.orderId}`}
                  className="block w-full bg-[#F5F5F3] text-[#2D2D2D] py-3 rounded-xl text-[15px] font-medium hover:bg-[#EBEBEB] transition-colors"
                >
                  Xem đơn hàng
                </Link>
              )}
              <Link
                to="/gio-hang"
                className="block w-full bg-[#7C9A82] text-white py-3 rounded-xl text-[15px] font-medium hover:bg-[#6B8A71] transition-colors"
              >
                Quay lại giỏ hàng
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VNPayReturn
