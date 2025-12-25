import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface ICart extends Document {
  user?: Types.ObjectId;
  guestId?: string;
  products: ICartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: {
      type: String,
    },
    products: {
      type: [cartItemSchema],
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
