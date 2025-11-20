import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";

const NewArrivalProducts = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const cleanURL = `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`.trim();
        const response = await axios.get(cleanURL);
        setNewArrivals(response.data);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
        setError("Failed to load new arrivals");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="w-full py-12 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Explore New Arrivals
        </h2>
        <p className="text-sm text-center text-gray-600 mb-8">
          Discover the latest styles straight off the runway, freshly added to
          keep your wardrobe on trend.
        </p>

        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-200 transition"
        >
          <FiChevronLeft className="text-2xl" />
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-200 transition"
        >
          <FiChevronRight className="text-2xl" />
        </button>

        <div className="relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth py-4"
          >
            {loading ? (
              <p className="text-center text-gray-500 w-full">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500 w-full">{error}</p>
            ) : newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <div
                  key={product._id}
                  className="min-w-[250px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition relative group flex-shrink-0"
                >
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-2">₹{product.price}</p>
                  </div>
                  <Link
                    to={`/product/${product._id}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 text-white font-semibold transition"
                  >
                    Shop Now
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 w-full">
                No new arrivals found.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalProducts;
