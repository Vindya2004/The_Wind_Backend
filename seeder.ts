import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product";
import User from "./models/User";
import Cart from "./models/Cart";
import products from "./data/products";

dotenv.config();

// MongoDB connect
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    const userId = adminUser._id;

    // ✅ IMPORTANT FIX HERE
    const sampleProducts = products.map((product) => ({
      ...product,
      user: userId, // schema expects "user", NOT userID
    }));

    await Product.insertMany(sampleProducts);

    console.log("Product data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

connectDB().then(seedData);
