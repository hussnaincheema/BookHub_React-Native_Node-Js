import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

//Create Book Route
router.post("/", protectRoute, upload.single("image"), async (req, res) => {
  try {
    const { title, caption, rating } = req.body;
    if (!title || !caption || !rating || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Please Provide all required fields including an image",
      });
    }

    // Upload image to cloudinary using buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "bookhub_books" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const imageUrl = result.secure_url;

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
      .populate("user", "username profileImage");

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

// Update Book Route
router.put("/:id", protectRoute, upload.single("image"), async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, caption, rating } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check ownership
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this book",
      });
    }

    let imageUrl = book.image;

    // If new image file is provided → delete old + upload new
    if (req.file) {
      try {
        // Delete old image if it exists on Cloudinary
        if (book.image && book.image.includes("cloudinary")) {
          const publicId = book.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }

        // Upload new image from buffer
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "bookhub_books" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.log("Cloudinary Update Error:", uploadError);
      }
    }

    // Update fields
    book.title = title || book.title;
    book.caption = caption || book.caption;
    book.rating = rating || book.rating;
    book.image = imageUrl;

    await book.save();

    res.json({
      success: true,
      message: "Book updated successfully",
      book,
    });

  } catch (error) {
    console.log("Error in Update Book Route:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
});

// Get Recommended Books by Logged in User
router.get("/user", protectRoute, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBooks = await Book.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in Get Recommended Books Route:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
});

//Delete Book Route
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if the user is the owner of the book
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this book",
      });
    }

    //Delete Image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from Cloudinary:", deleteError);
      }
    }

    await book.deleteOne();

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.log("Error in Delete Book Route:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
});


export default router;
