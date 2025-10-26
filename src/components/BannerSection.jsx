import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "/src/animations/fadeIn.js";
import bannerS from "../assets/banner/section.jpg"

const BannerSection = () => {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative my-20 mx-6 md:mx-16 rounded-3xl overflow-hidden shadow-lg"
    >
      {/* Ảnh nền */}
      <img
        src={bannerS}
        alt="Limited Edition"
        className="w-full h-[350px] md:h-[450px] object-cover brightness-75"
      />

      {/* Nội dung nổi */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-10 md:px-20">
        <motion.h2
          variants={fadeInUp}
          className="text-white text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg"
        >
          🌟 Bộ sưu tập đặc biệt 2025
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-gray-100 mb-6 text-lg md:text-xl max-w-md"
        >
          Khám phá những mô hình phiên bản giới hạn — dành riêng cho người sưu tầm
          và fan chính hiệu!
        </motion.p>
        <motion.button
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Xem ngay
        </motion.button>
      </div>
    </motion.section>
  );
};

export default BannerSection;
