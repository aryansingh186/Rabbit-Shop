import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "sonner";


const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "shirt", price: 10, sku: "SKU001" },
    { id: 2, name: "jeans", price: 20, sku: "SKU002" },
    { id: 3, name: "jeans", price: 20, sku: "SKU002" },
    { id: 4, name: "jeans", price: 20, sku: "SKU002" },
    { id: 5, name: "jeans", price: 20, sku: "SKU002" },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id));
      toast.success("Product deleted successfully!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Price</th>
              <th className="p-3 border-b">SKU</th>
              <th className="p-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border-b">{product.name}</td>
                <td className="p-3 border-b">₹{product.price.toFixed(2)}</td>
                <td className="p-3 border-b">{product.sku}</td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/admin/edit-product/${product.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 "
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default ProductManagement;
