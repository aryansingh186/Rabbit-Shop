import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductGrid from "./ProductGrid";

const WomensTops = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWomensTops = async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/products/womens-tops`;
        console.log("🔍 Fetching women's tops from:", url);
        
        const { data } = await axios.get(url);
        console.log(" Women's tops received:", data);
        
        setProducts(data || []);
        setError(null);
      } catch (err) {
        console.error(" Error fetching women's tops:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchWomensTops();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Loading women's tops...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No women's tops available</p>
      </div>
    );
  }

  return <ProductGrid products={products} />;
};

export default WomensTops;