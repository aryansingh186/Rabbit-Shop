import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBox, FaShoppingBag, FaRupeeSign } from "react-icons/fa";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Fetch all stats in parallel
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, config),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`, config),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/admin/all`, config),
      ]);

      const totalRevenue = ordersRes.data.reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );

      setStats({
        totalUsers: usersRes.data.length,
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalRevenue,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: FaUsers,
      color: "blue",
      link: "/admin/users",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: FaBox,
      color: "green",
      link: "/admin/products",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: FaShoppingBag,
      color: "purple",
      link: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: FaRupeeSign,
      color: "red",
      link: "/admin/orders",
    },
  ];

  const colorClasses = {
    blue: "border-blue-500 bg-blue-50",
    green: "border-green-500 bg-green-50",
    purple: "border-purple-500 bg-purple-50",
    red: "border-red-500 bg-red-50",
  };

  const iconColorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className={`p-6 rounded-xl shadow-md border-l-4 ${colorClasses[stat.color]} hover:shadow-lg transition-all transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div
                className={`p-4 rounded-full ${iconColorClasses[stat.color]} text-white`}
              >
                <stat.icon size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/add-product"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
          >
            <FaBox className="mx-auto mb-2 text-blue-500" size={32} />
            <p className="font-semibold text-gray-700">Add New Product</p>
          </Link>
          <Link
            to="/admin/orders"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
          >
            <FaShoppingBag className="mx-auto mb-2 text-purple-500" size={32} />
            <p className="font-semibold text-gray-700">View Orders</p>
          </Link>
          <Link
            to="/admin/users"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center"
          >
            <FaUsers className="mx-auto mb-2 text-green-500" size={32} />
            <p className="font-semibold text-gray-700">Manage Users</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;