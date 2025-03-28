import { verifyToken } from "@/utils/jwt.util";
import { NextFunction, Request, Response } from "express";

// Middleware to verify JWT token from HTTP-only cookie
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Get the token from the cookie
    const token = req.cookies?.token; // Assuming the cookie is named 'token'

    console.log("dd", token);
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization denied.",
      });
    }

    // Verify the token
    const decoded = verifyToken(token); // Make sure to store your secret in .env

    // Add decoded user data to request object
    // @ts-expect-error .user is not a property of req
    req.user = decoded; // This will contain the payload you set when creating the token

    // Proceed to the next middleware/route handler
    next();
  } catch (error: any) {
    console.error("Error during authentication:", error);
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Authorization denied.",
      });
    }

    // Handle any other errors
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

// Example usage in your Express app
/*
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware setup
app.use(cookieParser()); // Required to parse cookies

// Protected route example
app.get('/protected', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to protected route',
    user: req.user
  });
});
*/

export default authMiddleware;
