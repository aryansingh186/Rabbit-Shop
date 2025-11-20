import { useState } from "react";
import { toast } from "sonner";


const MOCK_ORDERS = [
  { id: 101, customer: "Aryan Singh", totalPrice: 1200, status: "Shipped" },
  { id: 102, customer: "Rohit Kumar", totalPrice: 850, status: "Delivered" },
  { id: 103, customer: "Anjali Verma", totalPrice: 450, status: "Cancel" },
];

const STATUS_OPTIONS = ["Shipped", "Delivered", "Cancel"];

const OrderManagement = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search);
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Management</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by Order ID or Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3 border-b">Order ID</th>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Total Price</th>
              <th className="p-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b font-medium">{order.id}</td>
                  <td className="p-3 border-b">{order.customer}</td>
                  <td className="p-3 border-b">₹{order.totalPrice.toFixed(2)}</td>
                  <td className="p-3 border-b">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`border p-1 rounded ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "Shipped"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default OrderManagement;
