import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { HiAdjustmentsHorizontal, HiMagnifyingGlass } from "react-icons/hi2";

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    size: "",
    color: "",
    gender: "",
    sortBy: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/products`.trim();
        const { data } = await axios.get(url);
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter(p => {
        if (max) return p.price >= min && p.price <= max;
        return p.price >= min;
      });
    }

    // Size filter
    if (filters.size) {
      result = result.filter(p => p.sizes?.includes(filters.size));
    }

    // Color filter
    if (filters.color) {
      result = result.filter(p => p.colors?.includes(filters.color));
    }

    // Gender filter
    if (filters.gender) {
      result = result.filter(p => p.gender === filters.gender);
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price_low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_high":
          result.sort((a, b) => b.price - a.price);
          break;
        case "name_asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "newest":
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }

    setFilteredProducts(result);
  }, [products, filters, searchQuery]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      size: "",
      color: "",
      gender: "",
      sortBy: ""
    });
  };

  // Get unique values for filters
  const categories = [...new Set(products.map(p => p.category))];
  const sizes = [...new Set(products.flatMap(p => p.sizes || []))];
  const colors = [...new Set(products.flatMap(p => p.colors || []))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <section className="w-full py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Our Collection"}
          </h2>
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <HiAdjustmentsHorizontal className="h-5 w-5" />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex flex-wrap items-center gap-3 flex-1">
              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Price Range */}
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Prices</option>
                <option value="0-500">Under ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-2000">₹1000 - ₹2000</option>
                <option value="2000-5000">₹2000 - ₹5000</option>
                <option value="5000">Above ₹5000</option>
              </select>

              {/* Size */}
              {sizes.length > 0 && (
                <select
                  value={filters.size}
                  onChange={(e) => handleFilterChange("size", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sizes</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              )}

              {/* Gender */}
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Genders</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Clear Filters
              </button>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 hidden sm:block">Sort:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t space-y-3">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Prices</option>
                <option value="0-500">Under ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-2000">₹1000 - ₹2000</option>
                <option value="2000-5000">₹2000 - ₹5000</option>
                <option value="5000">Above ₹5000</option>
              </select>

              {sizes.length > 0 && (
                <select
                  value={filters.size}
                  onChange={(e) => handleFilterChange("size", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sizes</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              )}

              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Genders</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>

              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <Link to={`/product/${product._id}`} className="block">
                  <div className="relative">
                    <img
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.isBestSeller && (
                      <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Best Seller
                      </span>
                    )}
                    {product.countInStock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-3">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 truncate hover:text-blue-600 transition">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-800 font-bold">₹{product.price}</p>
                    {product.discountPrice && (
                      <p className="text-gray-400 line-through text-xs">
                        ₹{product.discountPrice}
                      </p>
                    )}
                  </div>

                  {/* Category & Brand */}
                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    {product.category} {product.brand && `• ${product.brand}`}
                  </p>

                  {/* Sizes */}
                  {product.sizes?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.sizes.slice(0, 4).map((size) => (
                        <span
                          key={size}
                          className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
                        >
                          {size}
                        </span>
                      ))}
                      {product.sizes.length > 4 && (
                        <span className="px-2 py-1 text-xs text-gray-400">
                          +{product.sizes.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <HiMagnifyingGlass className="h-20 w-20 text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : "Try adjusting your filters"}
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionPage;