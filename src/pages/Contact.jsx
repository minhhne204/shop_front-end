import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/fadeIn";

const Contact = () => {
  return (
    <section className="pt-32 pb-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="text-4xl font-bold text-center mb-10 text-gray-800"
        >
          Liên hệ với chúng tôi
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Form liên hệ */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ tên của bạn"
                  className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nội dung
                </label>
                <textarea
                  rows="5"
                  placeholder="Nhập tin nhắn..."
                  className="mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Gửi liên hệ
              </button>
            </form>
          </motion.div>

          {/* Thông tin & Bản đồ */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.4 }}
            className="flex flex-col justify-between"
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Thông tin liên hệ
              </h2>
              <p className="text-gray-600 mb-2">
                📍 Địa chỉ: 123 Nguyễn Trãi, Hà Nội
              </p>
              <p className="text-gray-600 mb-2">📞 Điện thoại: 0987 654 321</p>
              <p className="text-gray-600">✉️ Email: support@finguer.vn</p>
            </div>

            <div className="overflow-hidden rounded-2xl shadow-lg h-64">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.868583055826!2d105.7762208750765!3d21.037203980613287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4e7e77c7cf%3A0x4fdd4bba60a8d4c!2zMTIzIE5ndXnhu4VuIFRy4bqhaSwgTmjDoCDEkOG7k25nLCBIw6AgTuG7mWkgQ8O0bmcsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1696829123456!5m2!1sen!2s"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                className="border-0"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
