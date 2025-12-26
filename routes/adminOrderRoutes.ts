import express, { Request, Response, Router } from "express";
import Order from "../models/Order";
import { protect, admin } from "../middleware/authMiddleware";

const router: Router = express.Router();

// @route   GET /api/admin/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get(
  "/",
  protect,
  admin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await Order.find({})
        .populate("user", "name email");

      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  admin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      // update status
      order.status = req.body.status ?? order.status;

      // delivered logic
      if (req.body.status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);


// @route   DELETE /api/admin/orders/:id
// @desc    Delete an order
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  admin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      await order.deleteOne();
      res.json({ message: "Order Removed" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);


export default router;
