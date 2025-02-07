import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';
import ApiResponse from '../utils/apiResponse.js';
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

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
        email,
        });
        if (existUser) {
            console.log("User already exists.");
            return res.status(400).json(new ApiResponse(400, 
                null, 
                "An account with this email already exists. Please log in instead"));
        }

        const existUser2 = await User.findOne({
            name,
            });
            if (existUser2) {
                console.log("User name already exists.");
                return res.status(400).json(new ApiResponse(400, 
                    null, 
                    "This username is already in use. Please choose another"));
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

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, password} = req.body
    
    console.log(email);

    if (!email) {
        throw new ApiError(404, "No account found with this user. Please sign up")
    }
    
    const user = await User.findOne({
        $or: [{email}]
    })
    
    if (!user) {
        return res.status(404).json(new ApiResponse(404, 
            null, 
            "No account found with this email. Please sign up."));
    }

    const isPasswordValid = await user.isPasswordCorrect(password); 


   if (!isPasswordValid) {
    return res.status(401).json(new ApiResponse(401, 
        null, 
       "Invalid user credentials"));
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

});

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req, res) => {
    console.log("inside getcurrent userid");
    console.log(req.user)
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})
const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});


export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
};
