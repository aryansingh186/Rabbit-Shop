import React, { useState } from "react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../../Redux/Slices/cartSlice";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CreditCard, Wallet, Truck } from "lucide-react";

const PaymentPage = () => {
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("COD");

  const { cart } = useSelector((state) => state.cart);
  const items = cart?.items || [];

  const { user, guestId: storedGuestId } = useSelector((state) => state.auth);
  const guestId = storedGuestId || localStorage.getItem("guestId");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Total
  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // ---------------------- HANDLE PAYMENT -------------------------
  const handlePayment = async (method, paypalOrderId = null) => {
    if (method === "UPI" && !upiId.trim()) {
      return toast.error("Enter UPI ID!");
    }

    if (!items.length) return toast.error("Cart is empty!");

    try {
      setLoading(true);

      const storedAddress = JSON.parse(localStorage.getItem("shippingAddress"));
      if (!storedAddress) {
        toast.error("Please add shipping address!");
        setLoading(false);
        return;
      }

      const isUserLoggedIn = !!user?._id;
     const token = localStorage.getItem("userToken");

      const orderData = {
        user: isUserLoggedIn ? user._id : undefined,
        guestId: !isUserLoggedIn ? guestId : undefined,
        items: items.map((item) => ({
          product: item._id || item.product,
          name: item.name,
          image: item.image || item.images?.[0],
          price: item.price,
          qty: item.quantity,
          size: item.size || "M",
          color: item.color || "Default",
        })),
        shippingAddress: storedAddress,
        paymentMethod: method,
        paymentStatus: method === "COD" ? "Pending" : "Paid",
        orderStatus: "Pending",
        totalPrice: totalAmount,
        paypalOrderId: paypalOrderId || undefined,
      };

      const config = {
  headers: {}
};

if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        orderData,
        config
      );

      toast.success("Order placed successfully! 🎉");

      dispatch(clearCart());
      localStorage.removeItem("shippingAddress");

      // ------------------ REDIRECT LOGIC FIX ------------------
      if (method === "COD") {
        navigate("/"); // redirect HOME
      } else {
        navigate(`/order/${res.data._id}`); // redirect ORDER PAGE
      }
    } catch (err) {
      console.error("ORDER ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Payment Failed!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- PAYPAL CONFIG -------------------------
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="max-w-2xl mx-auto mt-16 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Complete Your Payment
        </h2>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg mb-8 border border-indigo-100">
          <h3 className="font-semibold mb-3 text-lg text-gray-800">
            Order Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items ({items.length})</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="border-t border-indigo-200 mt-3 pt-3 flex justify-between font-bold text-lg text-gray-800">
              <span>Total Amount</span>
              <span className="text-indigo-600">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              ≈ ${(totalAmount / 83).toFixed(2)} USD
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">
            Select Payment Method
          </h3>

          {/* COD */}
          <div
            onClick={() => setSelectedMethod("COD")}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedMethod === "COD"
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck
                  className={
                    selectedMethod === "COD"
                      ? "text-indigo-600"
                      : "text-gray-600"
                  }
                  size={24}
                />
                <div>
                  <p className="font-medium text-gray-800">
                    Cash on Delivery
                  </p>
                  <p className="text-sm text-gray-500">
                    Pay when you receive
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* UPI */}
          <div
            onClick={() => setSelectedMethod("UPI")}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedMethod === "UPI"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <Wallet
                className={
                  selectedMethod === "UPI"
                    ? "text-green-600"
                    : "text-gray-600"
                }
                size={24}
              />
              <div>
                <p className="font-medium text-gray-800">UPI Payment</p>
                <p className="text-sm text-gray-500">
                  Google Pay, PhonePe, Paytm
                </p>
              </div>
            </div>
          </div>

          {/* PayPal */}
          <div
            onClick={() => setSelectedMethod("PayPal")}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedMethod === "PayPal"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard
                className={
                  selectedMethod === "PayPal"
                    ? "text-blue-600"
                    : "text-gray-600"
                }
                size={24}
              />
              <div>
                <p className="font-medium text-gray-800">PayPal</p>
                <p className="text-sm text-gray-500">
                  Credit/Debit Card & PayPal
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          {selectedMethod === "COD" && (
            <button
              onClick={() => handlePayment("COD")}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold shadow-lg"
            >
              {loading ? "Processing..." : "Place Order with COD"}
            </button>
          )}

          {selectedMethod === "UPI" && (
            <>
              <input
                type="text"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />
              <button
                onClick={() => handlePayment("UPI")}
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold shadow-lg"
              >
                {loading ? "Processing..." : "Pay via UPI"}
              </button>
            </>
          )}

          {selectedMethod === "PayPal" && (
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) =>
                actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: (totalAmount / 83).toFixed(2),
                      },
                    },
                  ],
                })
              }
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                toast.success("PayPal payment successful!");
                await handlePayment("PayPal", details.id);
              }}
              onError={() => toast.error("PayPal Error")}
            />
          )}
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default PaymentPage;
