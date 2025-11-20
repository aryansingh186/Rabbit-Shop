import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderDetails } from "../Redux/Slices/orderSlice";


const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orderDetails: order, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <div className="p-4 text-center">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-16 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/profile/orders")}
            className="mt-4 bg-black text-white px-4 py-2 rounded-md"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="p-4 text-center">Order not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate("/profile/orders")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Orders
      </button>

      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>

      {/* Order Info */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold">{order._id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-semibold">
              {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Status</p>
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
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
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Status</p>
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                order.paymentStatus === "Paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-semibold">{order.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-lg">Shipping Address</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">{order.shippingAddress?.fullName}</p>
          <p className="text-gray-700">{order.shippingAddress?.address}</p>
          <p className="text-gray-700">
            {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
            {order.shippingAddress?.postalCode}
          </p>
          <p className="text-gray-700">{order.shippingAddress?.country}</p>
          <p className="text-gray-700 mt-2">
            <span className="font-medium">Phone:</span> {order.shippingAddress?.phone}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="font-semibold mb-3 text-lg">Order Items</h3>
        <div className="border rounded-lg divide-y">
          {order.items?.map((item, index) => (
            <div key={index} className="flex gap-4 p-4">
              <img
                src={item.image || "https://via.placeholder.com/100"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <div className="text-sm text-gray-600 mt-1">
                  {item.size && <span>Size: {item.size} </span>}
                  {item.color && <span>| Color: {item.color} </span>}
                  <span>| Qty: {item.quantity}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">₹{item.price} each</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
          <span className="text-lg font-semibold">Total Amount:</span>
          <span className="text-2xl font-bold">₹{order.totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;