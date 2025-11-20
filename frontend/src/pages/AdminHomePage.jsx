import React from "react";
import { Link } from "react-router-dom";

const AdminHomePage = () => {
  const orders = [
    { _id: 123123, user: { name: "John Doe" }, totalPrice: 110, status: "Processing" },
    { _id: 1212, user: { name: "Jane Smith" }, totalPrice: 220, status: "Delivered" },
    { _id: 4545, user: { name: "Alex Roy" }, totalPrice: 340, status: "Shipped" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">Revenue</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">₹10,000</p>
        </div>

        <div className="p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">Total Orders</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{orders.length}</p>
        </div>

        <div className="p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">Total Products</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">50</p>
          <Link to="/" className="text-blue-500 hover:underline mt-2 block">
            Manage Products
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="mt-10 bg-white shadow-md rounded-xl overflow-hidden">
        <h2 className="text-2xl font-semibold mb-4 p-5 border-b text-gray-800">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="p-3 border-b">Order ID</th>
                <th className="p-3 border-b">User</th>
                <th className="p-3 border-b">Total Price</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b">{order._id}</td>
                  <td className="p-3 border-b">{order.user.name}</td>
                  <td className="p-3 border-b font-semibold text-gray-800">
                    ₹{order.totalPrice}
                  </td>
                 <td className="p-3 border-b">
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold 
      ${
        order.status === "Delivered"
          ? "bg-green-100 text-green-700"
          : order.status === "Shipped"
          ? "bg-blue-100 text-blue-700"
          : "bg-yellow-100 text-yellow-700"
      }
    `}
  >
    {order.status}
  </span>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
