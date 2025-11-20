const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  { _id: false }
);

// Cart Schema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    guestId: {
      type: String,
      required: false,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


cartSchema.index({ user: 1 });
cartSchema.index({ guestId: 1 });


cartSchema.pre("save", function (next) {
  let total = 0;
  let count = 0;

  this.items.forEach((item) => {
    total += item.price * item.quantity;
    count += item.quantity;
  });

  this.totalPrice = total;
  this.totalItems = count;

  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;