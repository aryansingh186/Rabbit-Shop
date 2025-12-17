import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";


// Mock product data
const MOCK_PRODUCTS = [
  { id: 1, name: "shirt", description: "Cotton shirt", price: 10, countInStock: 50, sku: "SKU001", size: "S,M,L", colors: "red,blue,green", image: "" },
  { id: 2, name: "jeans", description: "Denim jeans", price: 20, countInStock: 30, sku: "SKU002", size: "M,L,XL", colors: "blue,black", image: "" },
];

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: "",
    sku: "",
    size: "",
    colors: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const prod = MOCK_PRODUCTS.find((p) => p.id === parseInt(id));
    if (prod) {
      setProduct(prod);
      setImagePreview(prod.image || "");
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setProduct({ ...product, image: file });
      setImagePreview(URL.createObjectURL(file)); 
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success("Product updated successfully!");
    setTimeout(() => {
      navigate("/admin/products");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Product</h1>
      <div className="bg-white shadow-lg rounded-xl p-6">
        <form className="space-y-5" onSubmit={handleUpdate}>
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Count in Stock</label>
              <input
                type="number"
                name="countInStock"
                value={product.countInStock}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          </div>

          {/* SKU, Size, Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-semibold">SKU</label>
              <input
                type="text"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Sizes (comma-separated)</label>
              <input
                type="text"
                name="size"
                value={product.size}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="S,M,L,XL"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Colors (comma-separated)</label>
              <input
                type="text"
                name="colors"
                value={product.colors}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="red,blue,green"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-semibold">Upload Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-green-400">
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full cursor-pointer"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-lg shadow-md" />
              )}
            </div>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 w-full text-lg font-semibold"
          >
            Update Product
          </button>
        </form>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default EditProductPage;
