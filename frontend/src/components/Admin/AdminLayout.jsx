import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleLinkClick = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col justify-between shadow-xl`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 md:hidden">
          <Link to="/admin" onClick={handleLinkClick} className="flex flex-col">
            <span className="text-lg font-bold text-[#ea2e0e]">Rabbit</span>
            <span className="text-sm font-semibold">Admin Dashboard</span>
          </Link>
          <button onClick={toggleSidebar} className="text-xl font-bold hover:text-red-500">
            ✕
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-center p-6 border-b border-gray-700">
          <Link to="/admin" className="text-2xl font-bold text-[#ea2e0e] hover:text-red-600 transition">
            Rabbit
          </Link>
        </div>

        {/* Sidebar Content */}
        <AdminSidebar
          handleLinkClick={handleLinkClick}
          handleLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Top bar for mobile */}
        <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm md:hidden">
          <Link to="/admin" className="text-xl font-bold text-[#ea2e0e]">
            Rabbit
          </Link>
          <button onClick={toggleSidebar} className="hover:text-[#ea2e0e] transition">
            <FaBars size={24} />
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-grow p-6 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;