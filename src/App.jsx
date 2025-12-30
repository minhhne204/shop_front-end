import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Policy from './pages/Policy'
import Policies from './pages/Policies'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import ProductForm from './pages/admin/ProductForm'
import AdminOrders from './pages/admin/AdminOrders'
import AdminOrderDetail from './pages/admin/AdminOrderDetail'
import AdminCategories from './pages/admin/AdminCategories'
import AdminBrands from './pages/admin/AdminBrands'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBlogs from './pages/admin/AdminBlogs'
import BlogForm from './pages/admin/BlogForm'
import AdminBanners from './pages/admin/AdminBanners'
import AdminPromotions from './pages/admin/AdminPromotions'
import AdminPolicies from './pages/admin/AdminPolicies'
import AdminPreOrders from './pages/admin/AdminPreOrders'
import AdminReports from './pages/admin/AdminReports'
import Wishlist from './pages/Wishlist'
import PreOrder from './pages/PreOrder'
import MyPreOrders from './pages/MyPreOrders'
import UserStats from './pages/UserStats'
import VNPayReturn from './pages/VNPayReturn'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#7C9A82] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dang-nhap" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="san-pham" element={<AdminProducts />} />
              <Route path="san-pham/them" element={<ProductForm />} />
              <Route path="san-pham/:id" element={<ProductForm />} />
              <Route path="don-hang" element={<AdminOrders />} />
              <Route path="don-hang/:id" element={<AdminOrderDetail />} />
              <Route path="danh-muc" element={<AdminCategories />} />
              <Route path="thuong-hieu" element={<AdminBrands />} />
              <Route path="khach-hang" element={<AdminUsers />} />
              <Route path="tin-tuc" element={<AdminBlogs />} />
              <Route path="tin-tuc/them" element={<BlogForm />} />
              <Route path="tin-tuc/:id" element={<BlogForm />} />
              <Route path="banner" element={<AdminBanners />} />
              <Route path="khuyen-mai" element={<AdminPromotions />} />
              <Route path="chinh-sach" element={<AdminPolicies />} />
              <Route path="pre-order" element={<AdminPreOrders />} />
              <Route path="bao-cao" element={<AdminReports />} />
            </Route>

            <Route path="/*" element={
              <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/san-pham" element={<Products />} />
                    <Route path="/san-pham/:slug" element={<ProductDetail />} />
                    <Route path="/pre-order" element={<PreOrder />} />
                    <Route path="/pre-order/cua-toi" element={<MyPreOrders />} />
                    <Route path="/gio-hang" element={<Cart />} />
                    <Route path="/thanh-toan" element={<Checkout />} />
                    <Route path="/thanh-toan/vnpay-return" element={<VNPayReturn />} />
                    <Route path="/dang-nhap" element={<Login />} />
                    <Route path="/dang-ky" element={<Register />} />
                    <Route path="/tai-khoan" element={<Account />} />
                    <Route path="/don-hang" element={<Orders />} />
                    <Route path="/don-hang/:id" element={<OrderDetail />} />
                    <Route path="/thong-ke" element={<UserStats />} />
                    <Route path="/yeu-thich" element={<Wishlist />} />
                    <Route path="/tin-tuc" element={<Blog />} />
                    <Route path="/tin-tuc/:slug" element={<BlogDetail />} />
                    <Route path="/chinh-sach" element={<Policies />} />
                    <Route path="/chinh-sach/:type" element={<Policy />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
