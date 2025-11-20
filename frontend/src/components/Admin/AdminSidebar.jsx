import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaBox, FaShoppingBag, FaSignOutAlt, FaStore } from "react-icons/fa";

const AdminSidebar = ({ handleLinkClick, handleLogout }) => {
  return (
    <div className="flex flex-col justify-between h-full p-4 md:p-6">
      {/* Links */}
      <div className="flex flex-col space-y-3 mt-4 md:mt-0">
        <Link
          to="/admin/users"
          onClick={handleLinkClick}
          className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 transition-all"
        >
          <FaUser /> Users
        </Link>
        <Link
          to="/admin/products"
          onClick={handleLinkClick}
          className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 transition-all"
        >
          <FaBox /> Products
        </Link>
        <Link
          to="/admin/orders"
          onClick={handleLinkClick}
          className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 transition-all"
        >
          <FaShoppingBag /> Orders
        </Link>
        <Link
          to="/admin/shop"
          onClick={handleLinkClick}
          className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 transition-all"
        >
          <FaStore /> Shop
        </Link>
      </div>

      {/* Logout */}
      <div className="mt-4 md:mt-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-3 rounded-md bg-red-700 hover:bg-red-600 transition-all w-full text-left"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
