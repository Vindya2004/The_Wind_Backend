// const jwt = require("jsonwebtoken")
// const User = require("../models/User")

// // Middleware to protect routes

// const protect = async (req,resizeBy, next) => {
//     let token

//     if (
//         req.headers.authorization && 
//         req.headers.authorization.startsWith(Bearer)
//     ) {
//         try{
//             token = req.headers.authorization.split(" ")[1]
//             const decoded = jwt.verify(token,process.env.JWT_SECRET)

//             req.user = await User.findById(decoded.user.id).select("-password") //Exclude password
//             next()
//         }catch(error){
//             console.error("Token verification failed:", error)
//             resizeBy.status(401).json({message: "Not authorized, token failed"})
//         }

//     }else{
//         resizeBy.status(401).json({message: "Not authorized,no token provided"})
//     }
// }
// module.exports = { protect}

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface JwtPayload {
    user: {
        id: string;
        role: string;
    };
}

// Extend Express Request
export interface AuthRequest extends Request {
    user?: any;
}

// ================= PROTECT =================
export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            ) as JwtPayload;

            req.user = await User.findById(decoded.user.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            return res.status(401).json({
                message: "Not authorized, token failed",
            });
        }
    } else {
        return res.status(401).json({
            message: "Not authorized, no token provided",
        });
    }
};

// ================= ADMIN =================
export const admin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            message: "Not authorized as an admin",
        });
    }
};

