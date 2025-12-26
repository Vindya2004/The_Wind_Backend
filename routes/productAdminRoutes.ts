// routes/adminProductRoutes.ts
import express, { Request, Response, Router } from "express";
import Product from "../models/Product";
import { protect, admin } from "../middleware/authMiddleware";

const router: Router = express.Router();

/**
 * @route   GET /api/admin/products
 * @desc    Get all products (Admin only)
 * @access  Private/Admin
 */
router.get(
  "/",
  protect,
  admin,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const products = await Product.find({});
      return res.json(products);
    } catch (error) {
      console.error("Get Products Error:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  }
);

export default router;
