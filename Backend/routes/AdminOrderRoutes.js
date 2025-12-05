const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

const router = express.Router();

// GET ALL ORDERS (Admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product", "name price images category brand")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Fetch All Orders Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// GET ORDER STATISTICS (Admin only) - MUST BE BEFORE /:id route
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find({});
    
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.totalPrice || 0);
    }, 0);

    res.json({
      totalOrders,
      totalRevenue,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    });
  } catch (error) {
    console.error("Fetch Stats Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// GET SINGLE ORDER BY ID (Admin only)
router.get("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price images category brand");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Fetch Order Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// UPDATE ORDER STATUS (Admin only) - Generic status update
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update status
    order.status = status;

    // Auto-update delivery fields if status is "Delivered"
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    // Populate and return
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate("user", "name email")
      .populate("items.product", "name price images category brand");

    res.json(populatedOrder);
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// MARK ORDER AS DELIVERED (Admin only) - Keep for backward compatibility
router.put("/:id/deliver", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = "Delivered";

    const updatedOrder = await order.save();

    res.json({
      message: "Order marked as delivered",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Deliver Order Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// DELETE ORDER (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.deleteOne({ _id: req.params.id });
    
    res.json({ 
      message: "Order deleted successfully",
      deletedOrderId: req.params.id 
    });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;