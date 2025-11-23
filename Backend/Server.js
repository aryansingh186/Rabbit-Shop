require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/CartRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const uploadRoutes = require("./routes/UploadRoutes");
const subscriberRoutes = require("./routes/SubscriberRoute");
const AdminRoutes = require("./routes/AdminRoutes");
const productAdminRoutes = require("./routes/ProductAdminRoute");
const adminOrderRoutes = require("./routes/AdminOrderRoutes");

const app = express();

// JSON middleware
app.use(express.json());


app.use(
  cors({
    origin: [
      "https://rabbit-shop-pb3b.vercel.app", 
      "http://localhost:5173" 
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Rabbit API 🚀");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscriberRoutes);

// Admin Routes
app.use("/api/Admin/users", AdminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);


module.exports = app;

// Local server 
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
