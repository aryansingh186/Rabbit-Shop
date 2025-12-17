import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCartItemQuantity, removeFromCart } from "../../Redux/Slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Get product ID with null check
  const getProductId = (item) => {
    if (!item) return null;
    if (typeof item.product === 'string') return item.product;
    if (item.product && item.product._id) return item.product._id;
    if (item._id) return item._id;
    return null;
  };

  const handleAddToCart = (item, delta) => {
    const productId = getProductId(item);
    if (!productId) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          cartItemId: productId,
          quantity: newQuantity,
          userId,
          guestId,
          size: item.size,
          color: item.color,
        })
      );
    }
  };

  const handleRemoveFromCart = (item) => {
    const productId = getProductId(item);
    if (!productId) return;

    dispatch(
      removeFromCart({
        cartItemId: productId,
        userId,
        guestId,
        size: item.size,
        color: item.color,
      })
    );
  };

  // Check if cart or items is empty
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.items
        .filter(item => item && getProductId(item)) // Filter out null items
        .map((item, index) => {
          const productId = getProductId(item);
          
          return (
            <div
              key={`${productId}-${item.size}-${item.color}-${index}`}
              className="flex items-start gap-3 border-b pb-3"
            >
              {/* Product Image */}
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name || "Product"}
                className="w-20 h-24 rounded-md object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">
                  {item.name || "Unknown Product"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Size: <span className="font-medium">{item.size || "N/A"}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Color: <span className="font-medium">{item.color || "N/A"}</span>
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleAddToCart(item, -1)}
                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-sm font-medium"
                  >
                    -
                  </button>

                  <span className="text-sm font-semibold w-8 text-center">
                    {item.quantity || 0}
                  </span>

                  <button
                    onClick={() => handleAddToCart(item, 1)}
                    className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-sm font-medium"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromCart(item)}
                  className="text-red-500 text-xs mt-2 hover:text-red-600 font-medium"
                >
                  Remove
                </button>
              </div>

              {/* Price */}
              <div className="flex-shrink-0">
                <span className="font-semibold text-gray-900 text-sm">
                  ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CartContents;