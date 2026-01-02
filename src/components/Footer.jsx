import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-[#EBEBEB] bg-gradient-to-b from-white to-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
          {/* BRAND */}
          <div>
            <Link
              to="/"
              className="inline-block text-[24px] font-semibold tracking-tight text-[#2D2D2D]"
            >
              Toy<span className="text-[#7C9A82]">Nime</span>
            </Link>

            <p className="mt-4 text-[14px] text-[#6B6B6B] leading-relaxed max-w-[280px]">
              Chuyên cung cấp mô hình chính hãng chất lượng cao, uy tín và giá
              tốt tại Việt Nam.
            </p>

            {/* SOCIAL */}
            <div className="flex items-center gap-4 mt-7">
              <SocialIcon>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SocialIcon>

              <SocialIcon>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />{" "}
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* DANH MỤC */}
          <FooterColumn title="Danh mục">
            <FooterLink to="/san-pham">Tất cả sản phẩm</FooterLink>
            <FooterLink to="/pre-order">Pre-Order</FooterLink>
            <FooterLink to="/tin-tuc">Tin tức</FooterLink>
          </FooterColumn>

          {/* CHÍNH SÁCH */}
          <FooterColumn title="Chính sách">
            <FooterLink to="/chinh-sach">Tất cả chính sách</FooterLink>
            <FooterLink to="/chinh-sach/shipping">Vận chuyển</FooterLink>
            <FooterLink to="/chinh-sach/return">Đổi trả</FooterLink>
            <FooterLink to="/chinh-sach/payment">Thanh toán</FooterLink>
          </FooterColumn>

          {/* LIÊN HỆ */}
          <FooterColumn title="Liên hệ">
            <FooterInfo icon="📧">contact@toynime.vn</FooterInfo>
            <FooterInfo icon="📞">1900 xxxx</FooterInfo>
            <FooterInfo icon="📍">Hà Nội, Việt Nam</FooterInfo>
          </FooterColumn>
        </div>

        {/* BOTTOM */}
        <div className="mt-16 pt-8 border-t border-[#EBEBEB] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#9A9A9A]">
            © 2025 ToyNime. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/chinh-sach/privacy"
              className="text-[13px] text-[#9A9A9A] hover:text-[#6B6B6B] transition"
            >
              Quyền riêng tư
            </Link>
            <Link
              to="/chinh-sach/terms"
              className="text-[13px] text-[#9A9A9A] hover:text-[#6B6B6B] transition"
            >
              Điều khoản
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ===== COMPONENT PHỤ ===== */

const FooterColumn = ({ title, children }) => (
  <div>
    <h4 className="text-[13px] font-semibold text-[#9A9A9A] uppercase tracking-widest mb-6">
      {title}
    </h4>
    <ul className="space-y-3">{children}</ul>
  </div>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="relative text-[14px] text-[#6B6B6B] hover:text-[#2D2D2D] transition group"
    >
      {children}
      <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-[#7C9A82] transition-all duration-300 group-hover:w-full" />
    </Link>
  </li>
);

const FooterInfo = ({ icon, children }) => (
  <li className="flex items-center gap-3 text-[14px] text-[#6B6B6B]">
    <span className="text-[16px]">{icon}</span>
    {children}
  </li>
);

const SocialIcon = ({ children }) => (
  <a
    href="#"
    className="w-10 h-10 rounded-full bg-[#F3F5F4] flex items-center justify-center text-[#6B6B6B]
    hover:bg-[#7C9A82] hover:text-white transition-all duration-300 hover:-translate-y-1"
  >
    {children}
  </a>
);

export default Footer;
