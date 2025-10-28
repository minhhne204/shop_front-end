import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ParallaxProvider } from 'react-scroll-parallax' // 👈 Thêm dòng này

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ParallaxProvider> 
      <CartProvider>
        <App />
      </CartProvider>
    </ParallaxProvider>
  </StrictMode>,
)
