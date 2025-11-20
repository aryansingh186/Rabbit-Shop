const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

// CREATE NEW ORDER (supports guest + logged-in)
router.post("/", async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      totalPrice,
      guestId,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user?._id,          
      guestId: !req.user?._id ? guestId : undefined, 
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentStatus || "Pending",
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET MY ORDERS (requires login)
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price images category brand");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch My Orders Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET ORDER BY ID 
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price images category brand");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // If order has a user, check auth
    if (order.user && (!req.user || order.user._id.toString() !== req.user._id.toString())) {
      return res.status(401).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Fetch Order Details Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
