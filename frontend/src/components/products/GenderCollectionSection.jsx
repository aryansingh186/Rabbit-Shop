import React from 'react';
import MensCollectionImage from '../../assets/mens-collection.webp';
import WomensCollectionImage from '../../assets/womens-collection.webp';
import { Link } from 'react-router-dom';

const GenderCollectionSection = () => {
  return (
    <section className="w-full py-1 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Men's Collection */}
          <div className="relative group">
            <img 
              src={MensCollectionImage} 
              alt="Men's Collection" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Men's Collection</h2>
              <Link 
                to="/collections/:collection" 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Women's Collection */}
          <div className="relative group">
            <img 
              src={WomensCollectionImage} 
              alt="Women's Collection" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Women's Collection</h2>
              <Link 
                to="/collections/:collection" 
                className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
