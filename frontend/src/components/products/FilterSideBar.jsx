import React, { useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const FilterSideBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const sidebarRef = useRef(null);

  // Close sidebar on click outside (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed lg:static top-0 left-0 h-full border-r-1 bg-white z-40 transform transition-all duration-300 ease-in-out w-3/4 sm:w-1/2 lg:w-1/4 p-4 shadow-lg lg:shadow-none overflow-y-auto
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-800">Filters</h2>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden text-gray-600 hover:text-black"
        >
          <IoMdClose size={20} />
        </button>
      </div>

      {/* Men’s Wear */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Men’s Wear</h3>
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <label><input type="checkbox" className="mr-2" /> Jackets</label>
          <label><input type="checkbox" className="mr-2" /> Jeans</label>
          <label><input type="checkbox" className="mr-2" /> Shirts</label>
          <label><input type="checkbox" className="mr-2" /> Hoodies</label>
        </div>
      </div>

      {/* Women’s Wear */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Women’s Wear</h3>
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <label><input type="checkbox" className="mr-2" /> Dresses</label>
          <label><input type="checkbox" className="mr-2" /> Tops</label>
          <label><input type="checkbox" className="mr-2" /> Skirts</label>
          <label><input type="checkbox" className="mr-2" /> Jackets</label>
        </div>
      </div>

      {/* Color */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Color</h3>
        <div className="flex flex-wrap gap-2">
          {["#000000", "#D97706", "#2563EB", "#DC2626", "#16A34A"].map((color) => (
            <button
              key={color}
              className="w-5 h-5 rounded-full border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            ></button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Size</h3>
        <div className="flex flex-wrap gap-2">
          {["XS", "S", "M", "L", "XL"].map((size) => (
            <button
              key={size}
              className="border border-gray-300 rounded px-2 py-0.5 text-xs hover:bg-black hover:text-white transition"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Material */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Material</h3>
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <label><input type="checkbox" className="mr-2" /> Cotton</label>
          <label><input type="checkbox" className="mr-2" /> Polyester</label>
          <label><input type="checkbox" className="mr-2" /> Denim</label>
          <label><input type="checkbox" className="mr-2" /> Leather</label>
          <label><input type="checkbox" className="mr-2" /> Wool</label>
        </div>
      </div>

      {/* Apply / Clear Buttons */}
      <div className="flex gap-2 mt-6">
        <button className="flex-1 bg-black text-white text-sm rounded-md py-1.5 hover:bg-gray-900">
          Apply
        </button>
        <button className="flex-1 border border-gray-300 text-sm rounded-md py-1.5 hover:bg-gray-100">
          Clear
        </button>
      </div>
    </div>
  );
};

export default FilterSideBar;
