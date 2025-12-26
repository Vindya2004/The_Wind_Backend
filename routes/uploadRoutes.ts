import express, { Request, Response, Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

const router: Router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage }); // Fixed: "Storage" → "storage"

// POST /upload - upload single image
router.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Function to handle stream upload to Cloudinary
    const streamUpload = (fileBuffer: Buffer): Promise<any> => {
      return new Promise((resolve, reject) => { // Fixed: "rejects" → "reject"
        const stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        // Convert buffer to stream and pipe to Cloudinary
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Call the upload function with correct buffer
    // Fixed: req.fle.duffer → req.file.buffer
    const result = await streamUpload(req.file.buffer);

    // Respond with the secure URL from Cloudinary
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;

