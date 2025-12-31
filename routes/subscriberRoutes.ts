import express, { Request, Response, Router } from "express";
import Subscriber from "../models/Subscriber";

const router: Router = express.Router();

/**
 * @route POST /api/subscribe
 * @desc Handle newsletter subscription
 * @access Public
 */
router.post("/subscribe", async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if email already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return res
        .status(400)
        .json({ message: "Email is already subscribed" });
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({ email });

    return res.status(201).json({
      message: "Successfully subscribed to the newsletter",
      subscriber,
    });
  } catch (error) {
    console.error("Subscribe Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
