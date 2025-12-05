import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [banners, setBanners] = useState([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, bannersRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/categories?limit=100'),
          api.get('/banners?position=home')
        ])
        setFeaturedProducts(productsRes.data.products || productsRes.data || [])
        setCategories(categoriesRes.data.categories || categoriesRes.data || [])
        setBanners(bannersRes.data.banners || bannersRes.data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  const goToBanner = (index) => {
    setCurrentBanner(index)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  if (loading) return <Loading />

  return (
    <div className="animate-fade-in">
      {banners.length > 0 ? (
        <div className="relative h-[500px] md:h-[600px] overflow-hidden group">
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-6xl mx-auto px-6 w-full">
                  <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6">
                      {banner.title}
                    </h1>
                    {banner.description && (
                      <p className="text-[16px] text-white/80 mb-8 leading-relaxed">
                        {banner.description}
                      </p>
                    )}
                    <Link
                      to={banner.link || '/san-pham'}
                      className="inline-flex items-center gap-2 bg-white text-[#2D2D2D] px-8 py-4 rounded-full text-[15px] font-medium hover:bg-[#7C9A82] hover:text-white transition-all duration-300"
                    >
                      Khám phá ngay
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {banners.length > 1 && (
            <>
              <button
                onClick={prevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToBanner(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentBanner
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="h-[400px] md:h-[500px] bg-gradient-to-br from-[#F5F5F3] to-[#EBEBEB] flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-semibold text-[#2D2D2D] leading-tight mb-6">
                Mô hình chính hãng
                <br />
                <span className="text-[#7C9A82]">Chất lượng cao</span>
              </h1>
              <p className="text-[16px] text-[#6B6B6B] mb-8 leading-relaxed">
                Chuyên cung cấp mô hình figure, statue từ các thương hiệu nổi tiếng với giá tốt nhất tại Việt Nam.
              </p>
              <Link
                to="/san-pham"
                className="inline-flex items-center gap-2 bg-[#2D2D2D] text-white px-8 py-4 rounded-full text-[15px] font-medium hover:bg-[#7C9A82] transition-all duration-300"
              >
                Khám phá ngay
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-20">
        {categories.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-[28px] font-semibold text-[#2D2D2D] mb-3">Danh mục sản phẩm</h2>
              <p className="text-[15px] text-[#6B6B6B]">Khám phá theo sở thích của bạn</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/san-pham?category=${category._id}`}
                  className="group bg-white rounded-2xl border border-[#EBEBEB] p-6 text-center hover:border-[#7C9A82] hover:shadow-md transition-all duration-300"
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-16 h-16 mx-auto mb-4 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                  <span className="text-[14px] font-medium text-[#2D2D2D] group-hover:text-[#7C9A82] transition-colors">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-[28px] font-semibold text-[#2D2D2D] mb-2">Sản phẩm nổi bật</h2>
              <p className="text-[15px] text-[#6B6B6B]">Những sản phẩm được yêu thích nhất</p>
            </div>
            <Link
              to="/san-pham"
              className="hidden md:inline-flex items-center gap-2 text-[14px] font-medium text-[#7C9A82] hover:text-[#6B8A71] transition-colors"
            >
              Xem tất cả
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#EBEBEB]">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F3] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-[#6B6B6B]">Chưa có sản phẩm nổi bật</p>
            </div>
          )}
          <div className="mt-8 text-center md:hidden">
            <Link
              to="/san-pham"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#7C9A82]"
            >
              Xem tất cả sản phẩm
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-5 bg-[#F5F5F3] rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-[16px] font-semibold text-[#2D2D2D] mb-2">Miễn phí vận chuyển</h3>
            <p className="text-[14px] text-[#6B6B6B]">Miễn phí ship từ 2 sản phẩm trở lên</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-5 bg-[#F5F5F3] rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-[16px] font-semibold text-[#2D2D2D] mb-2">Chính hãng 100%</h3>
            <p className="text-[14px] text-[#6B6B6B]">Cam kết sản phẩm chính hãng</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-5 bg-[#F5F5F3] rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-[#7C9A82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-[16px] font-semibold text-[#2D2D2D] mb-2">Đổi trả dễ dàng</h3>
            <p className="text-[14px] text-[#6B6B6B]">Hoàn tiền nếu không hài lòng</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
