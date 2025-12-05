import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaBox, FaShoppingBag, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

const AdminSidebar = ({ handleLinkClick, handleLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/admin", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/admin/users", icon: FaUser, label: "Users" },
    { path: "/admin/products", icon: FaBox, label: "Products" },
    { path: "/admin/orders", icon: FaShoppingBag, label: "Orders" },
  ];

  return (
    <div className="flex flex-col justify-between h-full p-4 md:p-6">
      {/* Navigation Links */}
      <div className="flex flex-col space-y-2 mt-4 md:mt-0">
        {navLinks.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            onClick={handleLinkClick}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              isActive(path)
                ? "bg-[#ea2e0e] text-white shadow-lg"
                : "hover:bg-gray-800 text-gray-300 hover:text-white"
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <div className="mt-4 md:mt-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all w-full text-white font-medium shadow-md"
        >
          <FaSignOutAlt size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;