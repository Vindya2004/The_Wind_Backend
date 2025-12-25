import express, { Request, Response, Router } from "express";
import Cart, { ICart } from "../models/Cart";
import Product from "../models/Product";
import mongoose from "mongoose";

const router: Router = express.Router();

/* ================= Helper ================= */
const getCart = async (
  userId?: string,
  guestId?: string
): Promise<ICart | null> => {
  if (userId) return await Cart.findOne({ user: userId });
  if (guestId) return await Cart.findOne({ guestId });
  return null;
};

/* ================= Add To Cart ================= */
router.post("/", async (req: Request, res: Response) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ GET FIRST IMAGE SAFELY
    const productImage =
      Array.isArray(product.images) && product.images.length > 0
        ? typeof product.images[0] === "string"
          ? product.images[0]
          : product.images[0].url
        : "";

    let cart = await getCart(userId, guestId);

    /* ===== CART EXISTS ===== */
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: productImage, // ✅ FIXED
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    }

    /* ===== CREATE NEW CART ===== */
    const newCart = await Cart.create({
      user: userId || undefined,
      guestId: guestId || `guest_${Date.now()}`,
      products: [
        {
          productId,
          name: product.name,
          image: productImage, // ✅ FIXED
          price: product.price,
          size,
          color,
          quantity,
        },
      ],
      totalPrice: product.price * quantity,
    });

    return res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/cart
// @desc    Update product quantity in cart (guest or user)
// @access  Public

router.put("/", async (req: Request, res: Response) => {
  const { productId, quantity, size, color, guestId, userId } = req.body as {
    productId: string;
    quantity: number;
    size: string;
    color: string;
    guestId?: string;
    userId?: string;
  };

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // ✅ Update or remove item
    if (quantity > 0) {
      cart.products[productIndex].quantity = quantity;
    } else {
      cart.products.splice(productIndex, 1); // quantity 0 → remove item
    }

    // ✅ Recalculate total price
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/cart
// @desc Remove a product from the cart
// @access Public
router.delete("/", async (req: Request<{}, {}, {
  productId: string;
  size: string;
  color: string;
  guestId?: string;
  userId?: string;
}>, res: Response) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    const cart = await getCart(userId, guestId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @routes GET /api/cart
// @desc Get logged-in user's or guest user's cart
// @access Public
router.get("/", async (req: Request<{}, {}, {}, { userId?: string; guestId?: string }>, res: Response) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});


export default router;
