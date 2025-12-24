
import express, {Request, Response, Router } from "express";
import Product from "../models/Product";
import { protect, admin, AuthRequest } from "../middleware/authMiddleware";

const router: Router = express.Router();

// @route POST /api/products
// @desc Create a Product
// @access Private/Admin
router.post(
    "/",
    protect,
    admin,
    async (req: AuthRequest, res: Response) => {
        try {
            const {
                name,
                description,
                price,
                discountPrice,
                countInStock,
                category,
                brand,
                sizes,
                colors,
                collections,
                material,
                gender,
                images,
                isFeatured,
                isPublished,
                tags,
                dimensions,
                weight,
                sku,
            } = req.body;

            const product = new Product({
                name,
                description,
                price,
                discountPrice,
                countInStock,
                category,
                brand,
                sizes,
                colors,
                collections,
                material,
                gender,
                images,
                isFeatured,
                isPublished,
                tags,
                dimensions,
                weight,
                sku,
                user: req.user!._id,
            });

            const createdProduct = await product.save();

            res.status(201).json(createdProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    }
);

// @route PUT /api/products/:id
// @desc Update an existing product
// @access Private/Admin
router.put(
    "/:id",
    protect,
    admin,
    async (req: AuthRequest, res: Response) => {
        try {
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            const {
                name,
                description,
                price,
                discountPrice,
                countInStock,
                category,
                brand,
                sizes,
                colors,
                collections,
                material,
                gender,
                images,
                isFeatured,
                isPublished,
                tags,
                dimensions,
                weight,
                sku,
            } = req.body;

            // ===== Update fields safely =====
            if (name !== undefined) product.name = name;
            if (description !== undefined) product.description = description;
            if (price !== undefined) product.price = price;
            if (discountPrice !== undefined)
                product.discountPrice = discountPrice;
            if (countInStock !== undefined)
                product.countInStock = countInStock;
            if (category !== undefined) product.category = category;
            if (brand !== undefined) product.brand = brand;
            if (sizes !== undefined) product.sizes = sizes;
            if (colors !== undefined) product.colors = colors;
            if (collections !== undefined)
                product.collections = collections;
            if (material !== undefined) product.material = material;
            if (gender !== undefined) product.gender = gender;
            if (images !== undefined) product.images = images;
            if (tags !== undefined) product.tags = tags;
            if (dimensions !== undefined)
                product.dimensions = dimensions;
            if (weight !== undefined) product.weight = weight;
            if (sku !== undefined) product.sku = sku;

            if (isFeatured !== undefined)
                product.isFeatured = isFeatured;
            if (isPublished !== undefined)
                product.isPublished = isPublished;

            const updatedProduct = await product.save();

            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server Error" });
        }
    }
);

// @route DELETE /api/products/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete(
    "/:id",
    protect,
    admin,
    async (req: AuthRequest, res: Response) => {
        try {
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }

            await product.deleteOne();

            res.status(200).json({
                message: "Product deleted successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Server Error",
            });
        }
    }
);


// @route GET /api/products
// @desc Get all products with optional filters
// @access Public
router.get("/", async (req: Request, res: Response) => {
    try {
        const {
            collection,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit,
        } = req.query as {
            collection?: string;
            size?: string;
            color?: string;
            gender?: string;
            minPrice?: string;
            maxPrice?: string;
            sortBy?: string;
            search?: string;
            category?: string;
            material?: string;
            brand?: string;
            limit?: string;
        };

        const query: any = {};
        let sort: any = {};

        // ===== Filters =====
        if (collection && collection.toLowerCase() !== "all") {
            query.collections = collection;
        }

        if (category && category.toLowerCase() !== "all") {
            query.category = category;
        }

        if (material) {
            query.material = { $in: material.split(",") };
        }

        if (brand) {
            query.brand = { $in: brand.split(",") };
        }

        if (size) {
            query.sizes = { $in: size.split(",") };
        }

        if (color) {
            query.colors = { $in: [color] };
        }

        if (gender) {
            query.gender = gender;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // ===== Sorting =====
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 };
                    break;
                case "priceDesc":
                    sort = { price: -1 };
                    break;
                case "popularity":
                    sort = { rating: -1 };
                    break;
                default:
                    sort = {};
            }
        }

        const products = await Product.find(query)
            .sort(sort)
            .limit(limit ? Number(limit) : 0);

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/best-seller", async (req: Request, res: Response) => {
    try {
        // Try to find the highest-rated published product first
        let bestSeller = await Product.findOne({ isPublished: true }).sort({ rating: -1 });

        // If no published product found, fallback to any product with highest rating
        if (!bestSeller) {
            bestSeller = await Product.findOne().sort({ rating: -1 });
        }

        // If still no product found, return 404
        if (!bestSeller) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json(bestSeller);
    } catch (error) {
        console.error("Error fetching best-seller:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/new-arrivals", async (req: Request, res: Response) => {
    try {
        // Fetch latest 8 products, sorted by creation date
        const newArrivals = await Product.find()
            .sort({ createdAt: -1 }) // descending order (latest first)
            .limit(8);

        if (!newArrivals || newArrivals.length === 0) {
            return res.status(404).json({ message: "No new arrivals found" });
        }

        res.status(200).json(newArrivals);
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get(
    "/:id",
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;

            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({
                    message: "Product Not Found",
                });
            }

            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Server Error",
            });
        }
    }
);

// @route GET /api/products/similar/:id
// @desc Retrieve similar products based on category & gender
// @access Public
router.get(
    "/similar/:id",
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const { id } = req.params;

            // 1️⃣ Get current product
            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }

            // 2️⃣ Find similar products
            const similarProducts = await Product.find({
                _id: { $ne: product._id }, // exclude current product
                category: product.category,
                gender: product.gender,
                isPublished: true,
            }).limit(4);

            res.status(200).json(similarProducts);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Server Error",
            });
        }
    }
);


export default router;


