import React from "react";
import { Link } from "react-router-dom";
import featured from "../../assets/featured.webp";

const Featuredcollections = () => {
  return (
    <section className="py-8 px-4 md:px-8 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center lg:items-start gap-8 bg-green-50 rounded-2xl overflow-hidden shadow-md lg:pt-8 ">
        
        {/* Left Section */}
        <div className="lg:w-1/2 p-8 text-center lg:text-left">
          <h2 className="font-semibold text-gray-700 mb-8">Comfort and Style</h2>
          <h1 className="lg:text-5xl text-4xl font-bold mb-12 text-gray-900">
            Apparel Made For Your Everyday Life
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed text-justify">
            Discover our exclusive collection of apparel designed to elevate your everyday style. 
            From casual wear to chic essentials, our pieces are crafted with comfort and quality in mind. 
            Whether you're heading to work, running errands, or enjoying a weekend outing, our versatile 
            clothing options ensure you look and feel your best.
          </p>
          <Link
            to="/collections/all"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Shop Now 
          </Link>
        </div>

        {/* Right Section - Image */}
        <div className="lg:w-1/2 flex justify-end ">
          <img
            src={featured}
            alt="Featured Collection"
            className="w-full sm:w-xl h-auto object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Featuredcollections;
