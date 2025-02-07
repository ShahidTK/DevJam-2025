import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
      console.log("🔹 Token received:", token); // Debug token
  
      if (!token) {
        console.log("⛔ No token found! Unauthorized request.");
        return next(new ApiError(401, "Unauthorized request"));
      }
  
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("✅ Decoded Token:", decodedToken); // Debug JWT payload
  
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
      console.log("✅ User found in DB:", user); // Debug user
  
      if (!user) {
        console.log("⛔ No matching user found! Invalid token.");
        return next(new ApiError(401, "Invalid Access Token"));
      }
  
      req.user = user; // Attach user to request
      next();
    } catch (error) {
      console.log("⛔ JWT Verification Error:", error.message);
      return next(new ApiError(401, error?.message || "Invalid access token"));
    }
  });
  