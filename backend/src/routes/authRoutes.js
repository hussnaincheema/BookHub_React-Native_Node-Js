import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters long",
      });
    }

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      });
    }

    // Get random avatar
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    // Create new user
    const user = new User({
      username,
      email,
      password,
      profileImage,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in Register Route:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({
        success: false,
        message: "User does not Exist"
      })
    }

    // Check Password
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials"
      })
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      message: "User Logged in Successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    })
  } catch (error) {
    console.log("Error in Login Route:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

export default router;
