import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/products`.trim();
        const { data } = await axios.get(url);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Collection</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm">₹{product.price}</p>

                {/* Sizes */}
                {product.sizes?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-600"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionPage;
