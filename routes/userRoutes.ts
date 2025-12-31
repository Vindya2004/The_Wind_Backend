import express, { Request, Response, Router } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { protect, AuthRequest } from "../middleware/authMiddleware";

const router: Router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });

        // UPDATE USER
        if (user) {
            user.name = name || user.name;
            if (role) user.role = role;
            if (password) user.password = password;

            await user.save();

            return res.status(200).json({
                message: "User updated successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }

        // CREATE USER
        const newUser = new User({
            name,
            email,
            password: password || "default123",
            role: role || "customer",
        });

        await newUser.save();

        const payload = {
            user: {
                id: newUser._id,
                role: newUser.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: "30d" },
            (err, token) => {
                if (err) throw err;

                res.status(201).json({
                    user: {
                        _id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                    },
                    token,
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

/* ================= LOGIN ================= */
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid Credentials" });

        const payload = {
            user: {
                id: user._id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: "30d" },
            (err, token) => {
                if (err) throw err;

                res.status(200).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

/* ================= PROFILE (PROTECTED) ================= */
router.get(
    "/profile",
    protect,
    async (req: AuthRequest, res: Response) => {
        res.status(200).json(req.user);
    }
);

export default router;





