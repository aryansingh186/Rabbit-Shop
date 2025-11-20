require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Product = require("./models/Product");


const products = require("./Data/Products"); 

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};


const seedData = async () => {
  try {
    await connectDB();


    await User.deleteMany();
    await Product.deleteMany();
    console.log("Existing data cleared.");

    const hashedPassword = await bcrypt.hash("Admin123", 10);
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("Default admin user created:", adminUser.email);

   
    const productsWithUser = products.map((product) => ({
      ...product,
      user: adminUser._id,
    }));

    
    await Product.insertMany(productsWithUser);
    console.log("Sample products inserted successfully.");

    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error.message);
    process.exit(1);
  }
}; 


seedData();
