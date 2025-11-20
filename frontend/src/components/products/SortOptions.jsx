import React from "react";
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from "react-icons/fa";

const SortOptions = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="flex items-center justify-end space-x-2 mb-4">
      <label className="text-sm text-gray-600 font-medium">Sort by:</label>
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
      >
        <option value="">Default</option>
        <option value="popularity">Popularity</option>
        <option value="low-to-high">Price: Low to High</option>
        <option value="high-to-low">Price: High to Low</option>
        
      </select>
      {sortOrder === "low-to-high" && <FaSortAmountUpAlt className="text-gray-600" />}
      {sortOrder === "high-to-low" && <FaSortAmountDownAlt className="text-gray-600" />}
    </div>
  );
};

export default SortOptions;
