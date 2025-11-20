import React, { useState } from "react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../../Redux/Slices/cartSlice";

const PaymentPage = () => {
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);

  const { cart } = useSelector((state) => state.cart);
  const items = cart?.items || [];

  const { user, guestId: storedGuestId } = useSelector((state) => state.auth);
  const guestId = storedGuestId || localStorage.getItem("guestId");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePayment = async (method) => {
    if (method === "UPI" && !upiId.trim()) {
      return toast.error("Enter UPI ID!");
    }

    if (!items.length) {
      return toast.error("Cart is empty!");
    }

    try {
      setLoading(true);

      const storedAddress = JSON.parse(localStorage.getItem("shippingAddress"));
      if (!storedAddress) return toast.error("Please add shipping address!");

      const isUserLoggedIn = !!user?._id;
      const token = localStorage.getItem("token");

      const orderData = {
        user: isUserLoggedIn ? user._id : undefined,
        guestId: !isUserLoggedIn ? guestId : undefined,
        items: items.map((item) => ({
          product: item._id || item.product,
          name: item.name,
          image: item.image || item.images?.[0],
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: storedAddress,
        paymentMethod: method,
        paymentStatus: method === "UPI" ? "Paid" : "Pending",
        totalPrice: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      };

      // Only send token if user is logged in
      const headers = isUserLoggedIn && token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        orderData,
        { headers }
      );

      toast.success("Order placed successfully! 🎉");

      dispatch(clearCart());
      localStorage.removeItem("shippingAddress");

      navigate(`/order/${res.data._id}`);
    } catch (err) {
      console.error("ORDER ERROR:", err.response?.data || err.message);
      toast.error("Payment Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-6 text-center">Payment</h2>

      <button
        onClick={() => handlePayment("COD")}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded-lg mb-4 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Cash On Delivery (COD)"}
      </button>

      <input
        type="text"
        placeholder="Enter UPI ID (e.g. user@upi)"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        className="w-full border px-3 py-2 rounded-md mb-3"
      />

      <button
        onClick={() => handlePayment("UPI")}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay via UPI"}
      </button>
    </div>
  );
};

export default PaymentPage;
