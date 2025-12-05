import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { FaTrash, FaEdit, FaSpinner, FaPlus, FaSearch } from "react-icons/fa";
import axios from "axios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  // Fetch Products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("✅ Products fetched:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Fetch products error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Remove from local state
      setProducts(products.filter(p => p._id !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  // Filter Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase()) ||
      product._id?.toString().includes(search);

    const matchesPrice = priceFilter
      ? priceFilter === "low"
        ? product.price < 500
        : priceFilter === "medium"
        ? product.price >= 500 && product.price < 2000
        : product.price >= 2000
      : true;

    return matchesSearch && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <Link
          to="/admin/add-product"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-md"
        >
          <FaPlus /> Add New Product
        </Link>
      </div>

      {/* Stats Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-500">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Total Products</h3>
        <p className="text-3xl font-bold text-gray-800">{products.length}</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-48"
          >
            <option value="">All Prices</option>
            <option value="low">Under ₹500</option>
            <option value="medium">₹500 - ₹2000</option>
            <option value="high">Above ₹2000</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-16 bg-white rounded-lg shadow-md">
          <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-3 text-gray-600 text-lg">Loading products...</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-4 border-b text-left font-semibold">Product ID</th>
                <th className="p-4 border-b text-left font-semibold">Name</th>
                <th className="p-4 border-b text-left font-semibold">Price</th>
                <th className="p-4 border-b text-left font-semibold">SKU</th>
                <th className="p-4 border-b text-left font-semibold">Stock</th>
                <th className="p-4 border-b text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 border-b font-medium text-sm text-blue-600">
                      #{product._id?.slice(-6).toUpperCase()}
                    </td>
                    <td className="p-4 border-b">
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <span className="font-medium text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 border-b font-semibold text-gray-800">
                      ₹{product.price?.toFixed(2) || "0.00"}
                    </td>
                    <td className="p-4 border-b text-gray-600">{product.sku || "N/A"}</td>
                    <td className="p-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          (product.countInStock || 0) > 10
                            ? "bg-green-100 text-green-700"
                            : (product.countInStock || 0) > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.countInStock || 0} units
                      </span>
                    </td>
                    <td className="p-4 border-b text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/edit-product/${product._id}`}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm font-medium"
                        >
                          <FaEdit /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2 text-sm font-medium"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-12 text-gray-500">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="text-lg">
                      {search || priceFilter
                        ? "No products match your filters"
                        : "No products found in database"}
                    </p>
                    <Link
                      to="/admin/add-product"
                      className="text-blue-600 hover:underline mt-2 inline-block"
                    >
                      Add your first product
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default ProductManagement;