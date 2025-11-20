import React, { useEffect } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import CartContents from "../cart/CartContents";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../Redux/Slices/cartSlice";

const CartDrawer = ({ drawerOpen, toggleDrawer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cart, loading, error } = useSelector((state) => state.cart);
  
  const guestId = localStorage.getItem("guestId") || null;
  const userId = user?._id;

  // Fetch cart when drawer opens

  useEffect(() => {
    if (drawerOpen && (userId || guestId)) {
      dispatch(fetchCart({ userId, guestId }));
    }
  }, [drawerOpen, userId, guestId, dispatch]);

  const cartHasItems = cart?.items && Array.isArray(cart.items) && cart.items.length > 0;

  const handleCheckOut = () => {
    toggleDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/CheckOutPage");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
     
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <button
          onClick={() => toggleDrawer(false)}
          className="text-gray-600 hover:text-black active:scale-90 transition"
          aria-label="Close cart drawer"
        >
          <HiMiniXMark className="h-6 w-6" />
        </button>
      </div>

      {/* Cart Content */}

      <div className="flex-grow overflow-y-auto p-4">
        {loading ? (
          <div className="text-gray-600 text-center mt-10">
            <div className="animate-pulse">Loading cart...</div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center mt-10">
            <p>Error: {error}</p>
          </div>
        ) : cartHasItems ? (
          <CartContents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <div className="text-gray-800 text-center mt-10">
            <p className="text-lg">Your cart is empty</p>
            
          </div>
        )}
      </div>

      {/* Checkout Button */}
      {cartHasItems && (
        <div className="p-4 border-t bg-white">
          <button
            onClick={handleCheckOut}
            className="bg-black text-white w-full py-3 rounded-md font-medium hover:bg-gray-900 active:scale-95 transition"
          >
            Checkout ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
          </button>
          <p className="flex justify-center text-xs text-gray-500 mt-2">
            Shipping and taxes calculated at checkout
          </p>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;