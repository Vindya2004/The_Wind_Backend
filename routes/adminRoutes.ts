import express, { Request, Response, Router } from "express";
import User from "../models/User";
import { protect, admin } from "../middleware/authMiddleware";

const router: Router = express.Router();

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get(
  "/",
  protect,
  admin,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await User.find({});
      return res.json(users);
    } catch (error) {
      console.error("Get Users Error:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  }
);

// @route   POST /api/admin/users
// @desc    Add a new user (admin only)
// @access  Private/Admin
router.post(
  "/",
  protect,
  admin,
  async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: string;
    };

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = new User({
        name,
        email,
        password,
        role: role || "customer",
      });

      await user.save();

      return res.status(201).json({
        message: "User created successfully",
        userId: user._id,
      });
    } catch (error) {
      console.error("Create User Error:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  }
);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user info (admin only) - Name, email, and role
 * @access  Private/Admin
 */
router.put(
  "/:id",
  protect,
  admin,
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    // Define allowed roles
    type AllowedRole = "customer" | "admin";

    const { name, email, role } = req.body as {
      name?: string;
      email?: string;
      role?: string; // from body, so it's string initially
    };

    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update name and email if provided
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;

      // Validate and update role only if provided and valid
      if (role !== undefined) {
        if (role !== "customer" && role !== "admin") {
          return res.status(400).json({
            message: "Invalid role. Allowed roles are 'customer' or 'admin'",
          });
        }
        user.role = role as AllowedRole; // now safe to cast
      }

      const updatedUser = await user.save();

      return res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update User Error:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  }
);

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user (Admin only)
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  admin,
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.deleteOne();

      return res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete User Error:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  }
);


export default router;
