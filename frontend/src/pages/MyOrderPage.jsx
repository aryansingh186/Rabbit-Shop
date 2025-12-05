import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserOrders } from "../Redux/Slices/orderSlice";

const MyOrderPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { user, userInfo } = useSelector((state) => state.auth);
  
  // Use either user or userInfo (both should work now)
  const currentUser = user || userInfo;

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, currentUser]);

  if (loading) {
    return <div className="p-4 text-center">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No orders found</p>
          <Link
            to="/collections/summer-collection"
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/order/${order._id}`}  
              className="bg-white p-4 rounded-lg shadow-md block hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm text-gray-500">
                    Order #{order.orderNumber || order._id.slice(-6)}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Items:</span> {order.items?.length || 0}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{order.totalPrice}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.paymentMethod}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrderPage;