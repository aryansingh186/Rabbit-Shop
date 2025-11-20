import React from 'react';
import hero_img from '../../assets/rabbit-hero.webp';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="w-full h-[300px] lg:h-[500px] relative overflow-hidden">
      <img
        src={hero_img}
        alt="Hero"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-white text-center p-6">
          <h1 className="text-6xl md:text-9xl font-bold uppercase mb-4 leading-[1.1]">
            Vacation <br /> Ready
          </h1>

          <p className="mt-4 text-lg md:text-xl tracking-tight">
            Discover our latest collection for your perfect getaway
          </p>

          {/* Change collection slug as per your app */}
          <Link to="/collections/summer-collection">
            <button className="mt-6 px-6 py-3 bg-white hover:bg-white/80 text-black rounded-sm transition">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
