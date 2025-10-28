import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../animations/fadeIn";
import f1 from "../assets/news/f1.webp";
import f2 from "../assets/news/f2.png";
import f3 from "../assets/news/f3.png";
import f4 from "../assets/news/f4.jpg";

const figures = [
  { name: "New game prize tháng 10", img: f1 },
  { name: "Zoro Wano", img: f2 },
  { name: "Zenitsu", img: f3 },
  { name: "Denji", img: f4},
];

const NewsFigure = () => {
  return (
    <section className="container mx-auto mt-16 px-6">
      <h2 className="text-xl font-semibold mb-6">📰 News Figure</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {figures.map((f, i) => (
          <motion.div
            key={f.name}
            variants={fadeIn("up", i * 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src={f.img}
              alt={f.name}
              className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
            />
            <p className="text-center text-sm font-medium mt-2 mb-3">
              {f.name}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default NewsFigure;
