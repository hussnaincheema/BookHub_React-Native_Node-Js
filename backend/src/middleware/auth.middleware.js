import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find User
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found, authorization denied",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token, authorization denied",
    });
  }
};
