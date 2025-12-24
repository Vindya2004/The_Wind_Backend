// import { timeStamp } from "node:console"
// import { url } from "node:inspector"

// const mongoose = require("mongoose")

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     discountPrice: {
//         type: Number
//     },
//     countInStock: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     sku: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     category: {
//         type: String,
//         required: true
//     },
//     brand: {
//         type: String,
//     },
//     sizes: {
//         type: [String],
//         required: true,
//     },
//     colors: {
//         type: [String],
//         required: true,
//     },
//     collections: {
//         type: String,
//         required: true
//     },
//     material: {
//         type: String,
//     },
//     gender: {
//         type: String,
//         enum: ["Men", "Women", "Unisex"],
//     },
//     images: [
//         {
//             url: {
//                 type: String,
//                 required: true
//             },
//             altText: {
//                 type: String
//             }
//         }
//     ],
//     isFeatured: {
//         type: Boolean,
//         default: false,
//     },
//     isPublished: {
//         type: Boolean,
//         default: false,
//     },
//     rating: {
//         type: Number,
//         default: 0,
//     },
//     numReviews: {
//         type: Number,
//         default: 0,
//     },
//     tags: [String],
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     metaTitle: {
//         type: String,
//     },
//     metaDescription: {
//         type: String,
//     },
//     metaKeywords: {
//         type: String,
//     },
//     dimensions: {
//         length: Number,
//         width: Number,
//         height: Number,
//     },
//     weight: Number,
// },
//     { timeStamps: true}
// )

// module.exports = mongoose.model("Product", productSchema)

import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    countInStock: number;
    sku: string;
    category: string;
    brand?: string;
    sizes: string[];
    colors: string[];
    collections: string;
    material?: string;
    gender?: "Men" | "Women" | "Unisex";
    images: {
        url: string;
        altText?: string;
    }[];
    isFeatured: boolean;
    isPublished: boolean;
    rating: number;
    numReviews: number;
    tags?: string[];
    user: mongoose.Types.ObjectId;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    weight?: number;
}

const productSchema: Schema<IProduct> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        category: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
        },
        sizes: {
            type: [String],
            required: true,
        },
        colors: {
            type: [String],
            required: true,
        },
        collections: {
            type: String,
            required: true,
        },
        material: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["Men", "Women", "Unisex"],
        },
        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                altText: {
                    type: String,
                },
            },
        ],
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        tags: [String],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        metaTitle: String,
        metaDescription: String,
        metaKeywords: String,
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
        },
        weight: Number,
    },
    {
        timestamps: true, // ✅ FIXED
    }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
