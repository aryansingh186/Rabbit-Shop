const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    countInStock: { type: Number, required: true, default: 0 },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    brand: { type: String },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    collections: [{ type: String }],
    material: { type: String },
    gender: { type: String, enum: ["men", "women"] },
    images: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: true },
    ratings: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
