import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Checkout = () => {
  const { cart, cartTotal, fetchCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    ward: user?.address?.ward || '',
    district: user?.address?.district || '',
    city: user?.address?.city || '',
    paymentMethod: 'cod',
    note: ''
  })

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [loadingAddress, setLoadingAddress] = useState(false)

  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [promoLoading, setPromoLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [promoError, setPromoError] = useState('')

  useEffect(() => {
    fetchProvinces()
  }, [])

  const fetchProvinces = async () => {
    try {
      const res = await fetch('https://provinces.open-api.vn/api/p/')
      const data = await res.json()
      setProvinces(data)
    } catch (error) {
      console.error('Error fetching provinces:', error)
    }
  }

  const fetchDistricts = async (provinceCode) => {
    setLoadingAddress(true)
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      const data = await res.json()
      setDistricts(data.districts || [])
      setWards([])
      setSelectedDistrict(null)
      setForm(prev => ({ ...prev, district: '', ward: '' }))
    } catch (error) {
      console.error('Error fetching districts:', error)
    } finally {
      setLoadingAddress(false)
    }
  }

  const fetchWards = async (districtCode) => {
    setLoadingAddress(true)
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      const data = await res.json()
      setWards(data.wards || [])
      setForm(prev => ({ ...prev, ward: '' }))
    } catch (error) {
      console.error('Error fetching wards:', error)
    } finally {
      setLoadingAddress(false)
    }
  }

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value
    const province = provinces.find(p => p.code === parseInt(provinceCode))
    setSelectedProvince(province)
    setForm(prev => ({ ...prev, city: province?.name || '' }))
    if (provinceCode) {
      fetchDistricts(provinceCode)
    } else {
      setDistricts([])
      setWards([])
    }
  }

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value
    const district = districts.find(d => d.code === parseInt(districtCode))
    setSelectedDistrict(district)
    setForm(prev => ({ ...prev, district: district?.name || '' }))
    if (districtCode) {
      fetchWards(districtCode)
    } else {
      setWards([])
    }
  }

  const handleWardChange = (e) => {
    const wardCode = e.target.value
    const ward = wards.find(w => w.code === parseInt(wardCode))
    setForm(prev => ({ ...prev, ward: ward?.name || '' }))
  }

  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const shippingFee = itemCount >= 2 ? 0 : 30000
  const finalTotal = cartTotal - discount + shippingFee

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    setPromoLoading(true)
    setPromoError('')
    try {
      const res = await api.post('/promotions/apply', {
        code: promoCode,
        orderTotal: cartTotal
      })
      setDiscount(res.data.discount)
      setAppliedPromo({
        code: res.data.code,
        discountType: res.data.discountType,
        discountValue: res.data.discountValue
      })
      setPromoError('')
    } catch (err) {
      setPromoError(err.response?.data?.message || 'Mã giảm giá không hợp lệ')
      setDiscount(0)
      setAppliedPromo(null)
    } finally {
      setPromoLoading(false)
    }
  }

  const handleRemovePromo = () => {
    setPromoCode('')
    setDiscount(0)
    setAppliedPromo(null)
    setPromoError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const orderData = {
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          street: form.street,
          ward: form.ward,
          district: form.district,
          city: form.city
        },
        paymentMethod: form.paymentMethod,
        note: form.note,
        promoCode: appliedPromo?.code || null,
        discount: discount
      }

      const res = await api.post('/orders', orderData)
      await fetchCart()
      navigate(`/don-hang/${res.data._id}`, { state: { success: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  if (cart.items.length === 0) {
    navigate('/gio-hang')
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
            <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Thông tin giao hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Họ tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  required
                  placeholder="Số nhà, tên đường"
                  className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Tỉnh/Thành phố</label>
                <select
                  value={selectedProvince?.code || ''}
                  onChange={handleProvinceChange}
                  required
                  className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] focus:border-[#7C9A82] transition-colors"
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Quận/Huyện</label>
                <select
                  value={selectedDistrict?.code || ''}
                  onChange={handleDistrictChange}
                  required
                  disabled={!selectedProvince || loadingAddress}
                  className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] focus:border-[#7C9A82] transition-colors disabled:bg-[#F5F5F3] disabled:cursor-not-allowed"
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Phường/Xã</label>
                <select
                  value={wards.find(w => w.name === form.ward)?.code || ''}
                  onChange={handleWardChange}
                  required
                  disabled={!selectedDistrict || loadingAddress}
                  className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] focus:border-[#7C9A82] transition-colors disabled:bg-[#F5F5F3] disabled:cursor-not-allowed"
                >
                  <option value="">Chọn phường/xã</option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
            <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Phương thức thanh toán</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${form.paymentMethod === 'cod' ? 'border-[#7C9A82] bg-[#F0F5F1]' : 'border-[#EBEBEB] hover:border-[#7C9A82]'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#7C9A82] focus:ring-[#7C9A82]"
                />
                <div className="flex-1">
                  <span className="text-[14px] font-medium text-[#2D2D2D]">Thanh toán khi nhận hàng (COD)</span>
                  <p className="text-[13px] text-[#6B6B6B] mt-0.5">Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
              </label>
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${form.paymentMethod === 'banking' ? 'border-[#7C9A82] bg-[#F0F5F1]' : 'border-[#EBEBEB] hover:border-[#7C9A82]'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="banking"
                  checked={form.paymentMethod === 'banking'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#7C9A82] focus:ring-[#7C9A82]"
                />
                <div className="flex-1">
                  <span className="text-[14px] font-medium text-[#2D2D2D]">Chuyển khoản ngân hàng</span>
                  <p className="text-[13px] text-[#6B6B6B] mt-0.5">Chuyển khoản trước khi giao hàng</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6">
            <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">Ghi chú</h2>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              placeholder="Ghi chú về đơn hàng..."
              className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors resize-none"
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 sticky top-[100px]">
            <h2 className="text-[16px] font-semibold text-[#2D2D2D] mb-5">
              Đơn hàng <span className="font-normal text-[#6B6B6B]">({itemCount} sản phẩm)</span>
            </h2>

            <div className="max-h-64 overflow-y-auto space-y-4 mb-5">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex gap-3">
                  <div className="w-16 h-16 flex-shrink-0 bg-[#F5F5F3] rounded-lg overflow-hidden">
                    <img
                      src={item.product.images?.[0] || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#2D2D2D] line-clamp-2">{item.product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] text-[#9A9A9A]">x{item.quantity}</span>
                      {item.product.salePrice && item.product.salePrice < item.product.price && (
                        <span className="text-[10px] text-white bg-[#C45C4A] px-1.5 py-0.5 rounded">
                          -{Math.round((1 - item.product.salePrice / item.product.price) * 100)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[13px] font-medium text-[#2D2D2D]">
                      {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                    </span>
                    {item.product.salePrice && item.product.salePrice < item.product.price && (
                      <p className="text-[11px] text-[#9A9A9A] line-through">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EBEBEB] pt-5 space-y-4">
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-[#F0F5F1] rounded-xl">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-[13px] font-medium text-[#7C9A82]">{appliedPromo.code}</p>
                      <p className="text-[11px] text-[#6B6B6B]">
                        Giảm {appliedPromo.discountType === 'percent' ? `${appliedPromo.discountValue}%` : formatPrice(appliedPromo.discountValue)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-[#9A9A9A] hover:text-[#C45C4A] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 bg-white border border-[#EBEBEB] rounded-xl px-4 py-2.5 text-[14px] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoCode.trim()}
                      className="px-5 py-2.5 bg-[#F5F5F3] rounded-xl text-[14px] font-medium text-[#2D2D2D] hover:bg-[#EBEBEB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {promoLoading ? '...' : 'Áp dụng'}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[12px] text-[#C45C4A] mt-2">{promoError}</p>
                  )}
                </div>
              )}

              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Tạm tính</span>
                  <span className="text-[#2D2D2D]">{formatPrice(cartTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#7C9A82]">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Phí vận chuyển</span>
                  <span className={shippingFee === 0 ? 'text-[#7C9A82]' : 'text-[#2D2D2D]'}>
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>
                {shippingFee === 0 && (
                  <p className="text-[12px] text-[#7C9A82] bg-[#F0F5F1] px-3 py-2 rounded-lg">
                    Miễn phí vận chuyển cho đơn từ 2 sản phẩm
                  </p>
                )}
                <div className="border-t border-[#EBEBEB] pt-3 flex justify-between">
                  <span className="text-[16px] font-semibold text-[#2D2D2D]">Tổng cộng</span>
                  <span className="text-[18px] font-semibold text-[#C45C4A]">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-[#FEF2F2] text-[#C45C4A] text-[13px] px-4 py-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D2D2D] text-white py-4 rounded-xl text-[15px] font-medium hover:bg-[#7C9A82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Checkout
