import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ VALIDATE
  const validateRegister = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!form.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateRegister()) return;

    setLoading(true);
    try {
      await register(form.email, form.password, form.fullName);
      navigate("/");
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || "Đăng ký thất bại",
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
            Tạo tài khoản để mua sắm nhanh hơn
          </p>

          <ul className="space-y-3 text-[#6B6B6B]">
            <li>✔ Theo dõi đơn hàng dễ dàng</li>
            <li>✔ Lưu sản phẩm yêu thích</li>
            <li>✔ Nhận ưu đãi & thông báo sớm</li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#EBEBEB] p-8 max-w-[420px] mx-auto w-full">
          <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-2">
            Tạo tài khoản
          </h2>

          <p className="text-sm text-[#6B6B6B] mb-6">
            Đăng ký để bắt đầu mua sắm
          </p>

          {errors.form && (
            <div className="bg-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 text-center">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-medium mb-2">Họ tên</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-sm
                  ${errors.fullName ? "border-red-500" : "border-[#EBEBEB]"}`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-sm
                  ${errors.email ? "border-red-500" : "border-[#EBEBEB]"}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-2">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-sm
                  ${errors.password ? "border-red-500" : "border-[#EBEBEB]"}`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-sm
                  ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#EBEBEB]"
                  }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D2D2D] text-white py-3.5 rounded-xl
              hover:bg-[#7C9A82] transition disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          <p className="text-center text-sm text-[#6B6B6B] mt-6">
            Đã có tài khoản?{" "}
            <Link
              to="/dang-nhap"
              className="text-[#7C9A82] font-medium hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
