const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

// Create Product
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, description, price, sku, category } = req.body;
    if (!name || !description || !price || !sku || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    const productExists = await Product.findOne({ sku });
    if (productExists) {
      return res.status(400).json({ message: "Product with this SKU already exists" });
    }
    const product = await Product.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Product Creation Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get All Products
router.get("/", async (req, res) => {
  try {
    const queryObj = {};
    if (req.query.size) queryObj.sizes = { $in: req.query.size.split(",") };
    if (req.query.color) queryObj.colors = { $in: req.query.color.split(",") };
    if (req.query.category) queryObj.category = req.query.category;
    if (req.query.brand) queryObj.brand = req.query.brand;
    if (req.query.gender) queryObj.gender = req.query.gender;
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }

    let sortObj = {};
    if (req.query.sort) {
      if (req.query.sort === "price_asc") sortObj.price = 1;
      if (req.query.sort === "price_desc") sortObj.price = -1;
      if (req.query.sort === "latest") sortObj.createdAt = -1;
    }

    const products = await Product.find(queryObj).sort(sortObj);
    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch Products Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// new arrivals
router.get("/new-arrivals", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch New Arrivals Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// best sellers
router.get("/best-sellers", async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true })
      .sort({ ratings: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch Best Sellers Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get Women's Tops
router.get("/womens-tops", async (req, res) => {
  try {
    const products = await Product.find({
      category: "tops",
      gender: "women"
    }).limit(8);
    
    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch Women's Tops Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/similar/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const query = {
      _id: { $ne: product._id },
      category: product.category,
    };

    if (product.gender) {
      query.gender = product.gender;
    }

    if (product.brand) {
      query.brand = product.brand;
    }

    const similarProducts = await Product.find(query).limit(8);

    res.status(200).json(similarProducts);
  } catch (error) {
    console.error("Fetch Similar Products Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});


// Update Product
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });
    const updatedProduct = await product.save();
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Product Update Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete Product
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product Delete Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Fetch Product Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
