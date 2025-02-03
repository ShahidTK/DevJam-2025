import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';
import ApiResponse from '../utils/apiResponse.js';

const registerUser = asyncHandler (async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("email: ", email);

        if ([name, email, password].some((field) => field?.trim() === "")) {
            console.log("Missing fields.");
            throw new ApiError(400, "All fields are required");
        }

        // Check if user already exists
        const existUser = await User.findOne({
            $or: [{ email }, { name }],
        });
        if (existUser) {
            console.log("User already exists.");
return res.status(400).json(new ApiResponse(400, null, "User already exists"));

        }

        // // Handle avatar upload
        // const avatarLocalPath = req.files?.avatar[0]?.path;
        // console.log("Avatar path:", avatarLocalPath);

        // let coverLocalPath;
        // if (req.files && Array.isArray(req.files.cover) && req.files.cover.length > 0) {
        //     coverLocalPath = req.files.cover[0].path;
        //     console.log("Cover path:", coverLocalPath);
        // }

        // if (!avatarLocalPath) {
        //     console.log("Avatar missing.");
        //     throw new ApiError(400, "Avatar is required");
        // }

        // // Upload avatar to Cloudinary
        // const avatar = await uploadOnCloudinary(avatarLocalPath);
        // if (!avatar) {
        //     console.log("Failed to upload avatar.");
        //     throw new ApiError(500, "Failed to upload avatar");
        // }

        // Create user in the database
        const newUser = await User.create({
            name: name.trim().toLowerCase(), // Fix
            email,
            password,
        });
        
        console.log("User created:", newUser);

        // Get the newly created user without sensitive info
        const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

        if (!createdUser) {
            console.log("User creation failed.");
            throw new ApiError(500, "Failed to create user");
        }

        return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));

    } catch (err) {
        console.error("Error in registerUser:", err);
        throw err; 
    }
});


export default registerUser;