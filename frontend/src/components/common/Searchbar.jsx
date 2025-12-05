import React, { useState, useEffect, useRef } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search products as user types
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`
        );

        // Filter products by search term
        const filtered = response.data.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(filtered.slice(0, 5)); 
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchTerm('');
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/collections/all?search=${encodeURIComponent(searchTerm)}`);
      handleSearchToggle();
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    handleSearchToggle();
  };

  return (
    <div
      ref={searchRef}
      className={`flex items-center justify-center w-full transition-all duration-100 ${
        isOpen ? "absolute top-0 left-0 bg-white h-24 z-50 shadow-md" : "w-auto"
      }`}
    >
      {isOpen ? (
        <div className="relative flex flex-col items-center justify-center w-full">
          <form 
            onSubmit={handleSearch}
            className="relative flex items-center justify-center w-full px-4"
          >
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="bg-gray-100 px-4 py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg w-full text-gray-800"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-all"
              >
                <HiMagnifyingGlass className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleSearchToggle}
              className="ml-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-all"
            >
              <HiMiniXMark className="h-6 w-6 text-gray-600" />
            </button>
          </form>

          {/* Search Results Dropdown */}
          {showResults && searchTerm.trim().length >= 2 && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-full md:w-1/2 max-w-2xl bg-white shadow-xl rounded-lg mt-2 max-h-96 overflow-y-auto z-50 border border-gray-200">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="mt-2">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                    >
                      {/* Product Image */}
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {product.category} {product.brand && `• ${product.brand}`}
                        </p>
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          ₹{product.price.toLocaleString()}
                          {product.discountPrice && (
                            <span className="text-gray-400 line-through ml-2 text-xs">
                              ₹{product.discountPrice.toLocaleString()}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Stock Badge */}
                      <div>
                        {product.countInStock > 0 ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* View All Results */}
                  <button
                    onClick={handleSearch}
                    className="w-full p-3 text-center text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                  >
                    View all results for "{searchTerm}"
                  </button>
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <HiMagnifyingGlass className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No products found</p>
                  <p className="text-sm mt-1">Try searching with different keywords</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={handleSearchToggle}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Search"
        >
          <HiMagnifyingGlass className="h-5 w-5 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default Searchbar;