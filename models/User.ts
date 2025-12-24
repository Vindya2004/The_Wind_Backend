// const mongoose = require("mongoose")
// const bcrypt = require("bcryptjs")

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         match: [/.+\@.+\..+/,"Please enter a valid email address"],
//     },
//     password: {
//         type: String,
//         required: true,
//         minLength: 6,
//     },
//     role: {
//         type: String,
//         enum: ["customer","admin"],
//         default: "customer"
//     },
// },
// { timeStamps: true }
// )

// // Password Hash middleware

// userSchema.pre("save",async function (next) {
//     if (!this.isModified("password")) return next()
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password, salt)
//     next()
// })

// // Match User entered password to hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password)
// }

// module.exports = mongoose.model("User", userSchema)
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Interface for User Document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "customer" | "admin";
    createdAt: Date;
    updatedAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true, 
            lowercase: true, 
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] 
        },
        password: { type: String, required: false, minlength: 6 }, // made optional for updates
        role: { type: String, enum: ["customer", "admin"], default: "customer" },
    },
    { timestamps: true }
);

// ✅ Password Hash middleware
userSchema.pre<IUser>("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match User entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;



