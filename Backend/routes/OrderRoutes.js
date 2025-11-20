const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

// CREATE NEW ORDER
router.post("/", protect, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      totalPrice,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
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

// For guest COD orders
router.post("/orders/guest", async (req, res) => {
  try {
    const { guestId, items, address } = req.body;
    if (!guestId || !items) {
      return res.status(400).json({ message: "Missing required info" });
    }

    const order = await Order.create({
      guestId,
      items,
      paymentMethod: "COD",
      status: "Processing",
      address,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Guest Order Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});


// GET MY ORDERS
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
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price images category brand");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Fetch Order Details Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;