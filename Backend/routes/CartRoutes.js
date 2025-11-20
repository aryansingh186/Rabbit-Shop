const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

// Helper: Extract token & decode
const getUserFromToken = (req) => {
  try {
    if (!req.headers.authorization) return null;
    const token = req.headers.authorization.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Helper: Populate cart product details
const populateCart = (cartQuery) =>
  cartQuery.populate(
    "items.product",
    "name price discountPrice images category brand"
  );

// Merge guest cart with user cart after login
router.post("/merge", protect, async (req, res) => {
  try {
    const { guestCartId } = req.body;
    if (!guestCartId) {
      return res.status(400).json({ message: "Guest cart ID is required" });
    }

    const guestCart = await Cart.findById(guestCartId);
    if (!guestCart) {
      return res.status(404).json({ message: "Guest cart not found" });
    }

    let userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      userCart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    for (const guestItem of guestCart.items) {
      const existingItemIndex = userCart.items.findIndex(
        (item) =>
          item.product.toString() === guestItem.product.toString() &&
          item.size === guestItem.size &&
          item.color === guestItem.color
      );

      if (existingItemIndex > -1) {
        userCart.items[existingItemIndex].quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    }

    await userCart.save();
    await Cart.findByIdAndDelete(guestCartId);

    res.status(200).json({
      message: "🛒 Guest cart merged successfully",
      cart: userCart,
    });
  } catch (error) {
    console.error("Merge Cart Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

// Get cart (for authenticated user or guest)
router.get("/", async (req, res) => {
  try {
    const { guestId } = req.query;
    const decoded = getUserFromToken(req);

    let cart;

    console.log("📥 GET /cart", { authenticated: !!decoded, guestId });

    if (decoded) {
      cart = await populateCart(Cart.findOne({ user: decoded.id }));
      console.log("👤 Cart for logged user:", cart ? "FOUND" : "NOT FOUND");
    }

    if (!cart && guestId) {
      cart = await populateCart(Cart.findOne({ guestId }));
      console.log("👻 Guest cart:", cart ? "FOUND" : "NOT FOUND");
    }

    if (!cart) return res.json({ items: [] });

    return res.json(cart);
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { productId, quantity = 1, size, color, guestId } = req.body;

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const decoded = getUserFromToken(req);
    let cart;

    // Find or create cart
    if (decoded) {
      cart = await Cart.findOne({ user: decoded.id });
      if (!cart) cart = new Cart({ user: decoded.id, items: [] });
    } else {
      if (!guestId) {
        return res.status(400).json({ message: "Guest ID is required" });
      }
      cart = await Cart.findOne({ guestId });
      if (!cart) cart = new Cart({ guestId, items: [] });
    }

    // Check if item already exists in cart
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingIndex > -1) {
      // Update quantity if item exists
      cart.items[existingIndex].quantity += quantity;
    } else {
      // Add new item with all required fields
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || product.image || "",
        price: product.discountPrice || product.price,
        size,
        color,
        quantity,
      });
    }

    await cart.save();
    const populatedCart = await populateCart(Cart.findById(cart._id));

    res.status(200).json({
      message: "Item added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Add Cart Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

// Update cart item quantity
router.put("/update", async (req, res) => {
  try {
    const { productId, quantity, size, color, guestId } = req.body;
    const decoded = getUserFromToken(req);

    let cart = decoded
      ? await Cart.findOne({ user: decoded.id })
      : await Cart.findOne({ guestId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    const populatedCart = await populateCart(Cart.findById(cart._id));

    res.json({
      message: "Cart updated",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

// Remove item from cart
router.delete("/remove", async (req, res) => {
  try {
    const { productId, size, color, guestId } = req.body;
    const decoded = getUserFromToken(req);

    let cart = decoded
      ? await Cart.findOne({ user: decoded.id })
      : await Cart.findOne({ guestId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.size === size &&
          item.color === color
        )
    );

    await cart.save();
    const populatedCart = await populateCart(Cart.findById(cart._id));

    res.json({
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Remove Item Error:", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

module.exports = router;