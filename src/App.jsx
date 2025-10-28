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


function App() {
  return (
    <CartProvider>
    <Router>
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
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </Router>
    </CartProvider>
  );
}

export default App;
