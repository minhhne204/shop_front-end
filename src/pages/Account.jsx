import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Account = () => {
  const { user } = useAuth()
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    ward: user?.address?.ward || '',
    district: user?.address?.district || '',
    city: user?.address?.city || ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [loadingAddress, setLoadingAddress] = useState(false)

  useEffect(() => {
    fetchProvinces()
  }, [])

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        ward: user.address?.ward || '',
        district: user.address?.district || '',
        city: user.address?.city || ''
      })
    }
  }, [user])

  useEffect(() => {
    if (provinces.length > 0 && user?.address?.city) {
      const province = provinces.find(p => p.name === user.address.city)
      if (province) {
        setSelectedProvince(province)
        fetchDistrictsWithPreselect(province.code, user.address.district, user.address.ward)
      }
    }
  }, [provinces, user])

  const fetchProvinces = async () => {
    try {
      const res = await fetch('https://provinces.open-api.vn/api/p/')
      const data = await res.json()
      setProvinces(data)
    } catch (error) {
      console.error('Error fetching provinces:', error)
    }
  }

  const fetchDistrictsWithPreselect = async (provinceCode, districtName, wardName) => {
    setLoadingAddress(true)
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      const data = await res.json()
      setDistricts(data.districts || [])

      if (districtName) {
        const district = data.districts?.find(d => d.name === districtName)
        if (district) {
          setSelectedDistrict(district)
          fetchWardsWithPreselect(district.code, wardName)
        }
      }
    } catch (error) {
      console.error('Error fetching districts:', error)
    } finally {
      setLoadingAddress(false)
    }
  }

  const fetchWardsWithPreselect = async (districtCode, wardName) => {
    setLoadingAddress(true)
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      const data = await res.json()
      setWards(data.wards || [])
    } catch (error) {
      console.error('Error fetching wards:', error)
    } finally {
      setLoadingAddress(false)
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await api.put('/auth/profile', {
        fullName: form.fullName,
        phone: form.phone,
        address: {
          street: form.street,
          ward: form.ward,
          district: form.district,
          city: form.city
        }
      })
      setMessage({ type: 'success', text: 'Cập nhật thành công' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-[28px] font-semibold text-[#2D2D2D] mb-8">Thông tin tài khoản</h1>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-[#F5F5F3] border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#6B6B6B]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Họ tên</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
            />
          </div>

          <div className="border-t border-[#EBEBEB] pt-6">
            <h3 className="text-[15px] font-semibold text-[#2D2D2D] mb-5">Địa chỉ giao hàng</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  placeholder="Số nhà, tên đường"
                  className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] placeholder-[#9A9A9A] focus:border-[#7C9A82] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Tỉnh/Thành phố</label>
                <select
                  value={selectedProvince?.code || ''}
                  onChange={handleProvinceChange}
                  className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] focus:border-[#7C9A82] transition-colors"
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#2D2D2D] mb-2">Quận/Huyện</label>
                  <select
                    value={selectedDistrict?.code || ''}
                    onChange={handleDistrictChange}
                    disabled={!selectedProvince || loadingAddress}
                    className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] focus:border-[#7C9A82] transition-colors disabled:bg-[#F5F5F3] disabled:cursor-not-allowed"
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
                    disabled={!selectedDistrict || loadingAddress}
                    className="w-full bg-white border border-[#EBEBEB] rounded-xl px-4 py-3.5 text-[14px] text-[#2D2D2D] focus:border-[#7C9A82] transition-colors disabled:bg-[#F5F5F3] disabled:cursor-not-allowed"
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
          </div>

          {message.text && (
            <div className={`text-center py-3 px-4 rounded-xl text-[14px] ${
              message.type === 'error'
                ? 'bg-[#FEF2F2] text-[#C45C4A]'
                : 'bg-[#F0F5F1] text-[#7C9A82]'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D2D2D] text-white py-4 rounded-xl text-[15px] font-medium hover:bg-[#7C9A82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Account
