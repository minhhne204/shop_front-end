import React from "react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import CategorySection from "../components/CategorySection";
import BannerSection from "../components/BannerSection";


const Home = () => {
  return (
    <div>
      <Hero /> 
      <CategorySection/>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <ProductSection />
      </section>
     <BannerSection/>
    </div>
  );
};

export default Home;
