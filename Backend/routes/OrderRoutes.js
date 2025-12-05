const express = require("express");
const { protect, admin, optionalAuth } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

const router = express.Router();

/* =========================================================
   USER ROUTES
========================================================= */

// CREATE ORDER (Guest + Auth)
router.post("/", optionalAuth, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      totalPrice,
      guestId,
      user: providedUserId,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const isLoggedIn = !!req.user?._id;

    const finalUserId = isLoggedIn ? req.user._id : providedUserId;
    const finalGuestId = !isLoggedIn ? guestId || `guest_${Date.now()}` : null;

    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    const order = new Order({
      user: finalUserId || null,
      guestId: finalGuestId,
      orderNumber,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentStatus || "Pending",
      orderStatus: "Pending",
      totalPrice,
    });

    const createdOrder = await order.save();
    const fullOrder = await Order.findById(createdOrder._id)
      .populate("user", "name email");

    res.status(201).json(fullOrder);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// GET MY ORDERS (Logged-in user only)
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price images category brand");

    res.json(orders);
  } catch (error) {
    console.error("Fetch My Orders Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* =========================================================
   ADMIN ROUTES — MUST BE ABOVE /:id
========================================================= */

// ORDER STATISTICS
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const allOrders = await Order.find();

    const totalRevenue = allOrders.reduce(
      (sum, o) => sum + (o.totalPrice || 0),
      0
    );

    res.json({
      totalOrders,
      totalRevenue,
      averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET ALL ORDERS (Admin)
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product", "name price images category brand")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin Get All Orders Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE ORDER STATUS
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({ message: "Order status is required" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = orderStatus;
    await order.save();

    const updated = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name price images category brand");

    res.json(updated);
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE ORDER
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    await Order.deleteOne({ _id: req.params.id });

    res.json({ message: "Order deleted", deletedOrderId: req.params.id });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* =========================================================
   GET ORDER BY ID — MUST BE LAST
========================================================= */

router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price images category brand");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user && req.user) {
      if (
        order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(401).json({ message: "Not authorized" });
      }
    }

    res.json(order);
  } catch (error) {
    console.error("Order Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
