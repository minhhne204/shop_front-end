import React, { useState, useEffect } from "react";
import banner1 from "../assets/banner/banner2.png";
import banner2 from "../assets/banner/banner3.webp";
import banner3 from "../assets/banner/banner4.webp";

const slides = [banner1, banner2, banner3];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[500px] bg-gray-200 mt-20 overflow-hidden rounded-2xl">
      {slides.map((slide, i) => (
        <img
          key={i}
          src={slide}
          alt={`banner-${i}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
            current === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/10"></div>
    </section>
  );
};

export default Hero;
