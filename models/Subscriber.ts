import mongoose, { Schema, Document, Model } from "mongoose";

/* Interface */
export interface ISubscriber extends Document {
  email: string;
  subscribeAt: Date;
}

/* Schema */
const subscriberSchema: Schema<ISubscriber> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    subscribeAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

/* Model */
const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>("Subscriber", subscriberSchema);

export default Subscriber;
