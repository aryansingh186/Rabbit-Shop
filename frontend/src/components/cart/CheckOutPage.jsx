import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const CheckOutPage = () => {
  const navigate = useNavigate();

  // Get cart and user info from Redux
  const { cart } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  
  // Auth check
  useEffect(() => {
    if (!user && !guestId) {
      toast.error("Please login or continue as guest to proceed");
      navigate("/login?redirect=checkout");
    }
  }, [user, guestId, navigate]);

  const items = cart?.items || [];
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    if (!items.length) {
      toast.error("Your cart is empty!");
      return navigate("/collection");
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "address",
      "city",
      "postalCode",
      "country",
      "phone",
    ];

    const isValid = requiredFields.every((field) => shippingAddress[field].trim() !== "");
    if (!isValid) {
      toast.error("Please fill all shipping details");
      return;
    }

    localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
    toast.success("Proceeding to payment...");
    navigate("/payment");
  };

  if (!items.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-600 text-xl mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate("/collection")}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition active:scale-95"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tight">
      {/* Shipping Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
        <form onSubmit={handleProceedToPayment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={shippingAddress.firstName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={shippingAddress.lastName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shippingAddress.address}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-black outline-none"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={shippingAddress.postalCode}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={shippingAddress.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white py-3 rounded-md w-full hover:bg-gray-900 transition active:scale-95"
          >
            Proceed to Payment
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {item.size} • {item.color}
                  </p>
                  <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t mt-6 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping:</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t pt-2">
            <span>Total:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          {items.length} item(s) in your cart
        </p>
      </div>
    </div>
  );
};

export default CheckOutPage;
