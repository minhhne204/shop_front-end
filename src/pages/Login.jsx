import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải từ 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || "Email hoặc mật khẩu không đúng",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F7F8] py-16 px-4">
      <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="hidden md:block">
          <h1 className="text-4xl font-bold text-[#2D2D2D] mb-4">
            Toy<span className="text-[#7C9A82]">Nime</span>
          </h1>
          <p className="text-[#6B6B6B] text-lg mb-6">
            Cửa hàng figure & mô hình anime chính hãng
          </p>

          <ul className="space-y-3 text-[#6B6B6B]">
            <li>✔ Sản phẩm chính hãng 100%</li>
            <li>✔ Pre-order giá tốt</li>
            <li>✔ Giao hàng toàn quốc</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-[420px] mx-auto w-full">
          <h2 className="text-2xl font-semibold mb-6">Đăng nhập</h2>

          {errors.form && (
            <div className="bg-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm
                  ${errors.email ? "border-red-500" : "border-[#EBEBEB]"}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm
                  ${errors.password ? "border-red-500" : "border-[#EBEBEB]"}`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D2D2D] text-white py-3.5 rounded-xl hover:bg-[#7C9A82]"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Chưa có tài khoản?{" "}
            <Link to="/dang-ky" className="text-[#7C9A82] font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
