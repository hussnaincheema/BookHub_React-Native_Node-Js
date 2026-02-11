import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//Create Book Route
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!title || !caption || !rating || !image) {
      return res.status(400).json({
        success: false,
        message: "Please Provide all required fields",
      });
    }

    // Upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // Save to the database
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });
    await newBook.save();

    res.status(201).json({
      success: true,
      message: "Book created successfully",
    });
  } catch (error) {
    console.log("Error in Create Book Route:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get Books Route
router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const books = (await Book.find())
      .sort({ createdAt: -1 }) //Descending order
      .skip(skip)
      .limit(limit)
      .population("user", "username profileImage");

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in Get Books Route:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
});

//Delete Book Route

export default router;
