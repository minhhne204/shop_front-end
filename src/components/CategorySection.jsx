import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "/src/animations/fadeIn.js";
import { categories } from "/src/data/categories.js";

const CategorySection = () => {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="px-6 md:px-16 py-16 bg-gray-50 rounded-3xl"
    >
        
      <h2 className="text-2xl font-bold text-center mb-10 border-b pb-2 text-gray-800 ">
        ♡ Hot Series - Character
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-28 h-28 mx-auto mb-4 overflow-hidden rounded-full border border-gray-200">
              <img
                src={cat.image}
                
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CategorySection;
