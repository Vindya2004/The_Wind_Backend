import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes"
import cartRoutes from "./routes/cartRoutes"
import checkoutRoutes from "./routes/checkoutRoutes"
import orderRoutes from "./routes/orderRoutes"

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

const PORT: number = Number(process.env.PORT) || 3000;

// Connect Database
connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send("WELCOME TO THE WIND API");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
