import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../animations/fadeIn";
import sv1 from "../assets/service 1.png";
import drgb from "../assets/drgb.png";
import nrt from "../assets/nrt.png";
import mha from "../assets/mha.png";
import jk from "../assets/jk.png";
import kny from "../assets/kny.png";



const characters = [
  { name: "One Piece", img: sv1 },
  { name: "Dragon Ball Z", img: drgb },
  { name: "Naruto", img: nrt },
  { name: "Kimetsu no Yaiba", img: kny },
  { name: "Jujutsu Kaisen", img:jk },
  { name: "My Hero Academia", img: mha },
];

const HotSeries = () => {
  return (
    <section className="container mx-auto mt-28 px-6">
      <h2 className="text-xl font-semibold mb-6">🔥 Hot Series - Character</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {characters.map((c, i) => (
          <motion.div
            key={c.name}
            variants={fadeIn("up", i * 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center"
          >
            <img
              src={c.img}
              alt={c.name}
              className="w-20 h-20 mx-auto object-contain hover:scale-110 transition-transform duration-200"
            />
            <p className="mt-2 text-sm">{c.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HotSeries;
