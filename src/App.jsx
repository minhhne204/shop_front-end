import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AllProducts from "./components/AllProducts";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* CLIENT LAYOUT */}
          <Route
            path="/*"
            element={
              <div className="font-poppins bg-white min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<AllProducts />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/policy" element={<Policy />} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />

          {/* ADMIN LAYOUT */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts/>} />
            <Route path="orders" element={<div>Quản lý đơn hàng</div>} />
            <Route path="users" element={<div>Quản lý người dùng</div>} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </CartProvider>
  );
}

export default App;
