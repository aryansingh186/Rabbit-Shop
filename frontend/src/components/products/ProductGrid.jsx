import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="border rounded-md p-2 hover:shadow-lg transition"
        >
          <img
            src={product.images?.[0] || ""}
            alt={product.name}
            className="w-full h-40 object-cover rounded-md mb-2"
          />
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="text-sm font-semibold">₹{product.price}</p>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
