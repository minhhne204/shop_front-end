import React from "react";
import { motion } from "framer-motion";
import { Parallax } from "react-scroll-parallax";
import { fadeInUp } from "/src/animations/fadeIn.js";
import aboutBanner from "/src/assets/banner/banner4.webp";
import storeImg from "../assets/banner/section.jpg";

const AboutPage = () => {
  return (
    <div className="mt-20 overflow-hidden">
      {/* 🔹 Banner parallax */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <Parallax speed={-20}>
          <img
            src={aboutBanner}
            alt="About Banner"
            className="w-full h-full object-cover brightness-75"
          />
        </Parallax>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="text-4xl md:text-6xl font-extrabold mb-3 drop-shadow-lg"
          >
            Giới thiệu về{" "}
            <span className="text-blue-400">Finguer Toynime</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="text-lg md:text-xl text-gray-200 max-w-2xl"
          >
            Cửa hàng chuyên figure & mô hình chính hãng – mang thế giới Anime
            đến gần bạn hơn.
          </motion.p>
        </div>
      </section>

      {/* 🔹 Section giới thiệu */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <img
            src={storeImg}
            alt="Store"
            className="rounded-3xl shadow-2xl object-cover hover:scale-105 transition-transform duration-700"
          />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-5"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Câu chuyện của chúng tôi
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Finguer Toynime ra đời từ niềm đam mê bất tận với văn hóa Anime &
            Manga. Chúng tôi mong muốn mang đến cho cộng đồng fan Việt Nam
            những sản phẩm chính hãng, chất lượng cao từ Nhật Bản và nhiều quốc
            gia khác.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Đội ngũ Finguer Toynime không chỉ bán sản phẩm — chúng tôi chia sẻ
            cảm hứng, kết nối và lan tỏa niềm đam mê figure đến mọi người.
          </p>
        </motion.div>
      </section>

      {/* 🔹 Parallax background section */}
      <Parallax speed={10}>
        <section className="relative bg-blue-50 py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center px-6">
            {[
              { number: "500+", label: "Sản phẩm chính hãng" },
              { number: "10K+", label: "Khách hàng hài lòng" },
              { number: "5+", label: "Năm hoạt động" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white rounded-2xl shadow p-8 hover:-translate-y-2 transition"
              >
                <h3 className="text-4xl font-bold text-blue-600 mb-2">
                  {item.number}
                </h3>
                <p className="text-gray-700 text-lg">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </Parallax>

      {/* 🔹 Lời cảm ơn */}
      <section className="text-center py-20 px-6">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          Cảm ơn bạn đã đồng hành cùng chúng tôi 💙
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-gray-600 max-w-3xl mx-auto text-lg"
        >
          Finguer Toynime luôn nỗ lực để mang lại trải nghiệm mua sắm tốt nhất,
          sản phẩm chất lượng và dịch vụ tận tâm.  
          Hãy cùng chúng tôi lan tỏa niềm đam mê Figure đến cộng đồng!
        </motion.p>
      </section>
    </div>
  );
};

export default AboutPage;
