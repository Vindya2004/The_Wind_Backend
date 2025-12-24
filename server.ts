import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes"

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
