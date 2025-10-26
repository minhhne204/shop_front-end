import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "/src/animations/fadeIn.js";

const Policy = () => {
  return (
    <div className="pt-28 pb-16 bg-gray-50 min-h-screen">
      {/* Banner */}
      <section className="relative h-[250px] bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
          Chính sách & Bảo hành
        </h1>
      </section>

      {/* Nội dung chính */}
      <div className="max-w-5xl mx-auto mt-12 px-6 space-y-12">
        {/* Bảo hành */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="bg-white p-8 rounded-2xl shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            🛠️ Chính sách bảo hành
          </h2>
          <p className="text-gray-700 leading-relaxed">
            - Tất cả sản phẩm được bảo hành chính hãng theo quy định của nhà sản
            xuất hoặc nhà phân phối.
            <br />- Thời gian bảo hành: <b>7 ngày đổi mới</b> nếu có lỗi từ nhà
            sản xuất.
            <br />- Sản phẩm phải còn nguyên vẹn, không bị trầy xước, nứt gãy
            hoặc có dấu hiệu can thiệp kỹ thuật.
          </p>
        </motion.div>

        {/* Đổi trả */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            🔁 Chính sách đổi trả
          </h2>
          <p className="text-gray-700 leading-relaxed">
            - Khách hàng được <b>đổi trả trong vòng 3 ngày</b> kể từ khi nhận
            hàng nếu sản phẩm có lỗi kỹ thuật hoặc sai mẫu.
            <br />- Sản phẩm đổi trả phải còn nguyên hộp, tem, phiếu bảo hành.
            <br />- Không áp dụng đổi trả với sản phẩm giảm giá, hàng thanh lý
            hoặc đặt theo yêu cầu riêng.
          </p>
        </motion.div>

        {/* Vận chuyển */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-2xl shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            🚚 Chính sách vận chuyển
          </h2>
          <p className="text-gray-700 leading-relaxed">
            - Giao hàng toàn quốc qua các đối tác uy tín (GHTK, GHN, Viettel
            Post...).
            <br />- Thời gian giao hàng: 1–3 ngày tại Hà Nội / TP.HCM, 3–5 ngày
            các tỉnh.
            <br />- Miễn phí vận chuyển cho đơn hàng trên <b>500.000đ</b>.
            <br />- Kiểm tra hàng trước khi thanh toán.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Policy;
