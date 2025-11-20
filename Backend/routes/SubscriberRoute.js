const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");


router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

   
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed!" });
    }

    
    const subscriber = new Subscriber({ email });
    await subscriber.save();

    res.status(201).json({
      message: " Successfully subscribed!",
      subscriber,
    });
  } catch (error) {
    console.error(" Error adding subscriber:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

  

router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    res.status(200).json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
