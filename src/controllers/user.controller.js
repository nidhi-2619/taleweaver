import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async(userId)=>{

    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    return {accessToken,refreshToken}
}




const registerUser = async(req,res)=>{
    const {username,email,password} = req.body

    if ([username,email,password].some(fields=>fields.trim()===""))
        throw new ApiError(400, "All fields are required.")

    if (!email.includes('@')){
        throw new ApiError(400, "Invalid email.")
    }

    if(password.length<6){
        throw new ApiError(400, "Password must be of atleast 6 length")
    }

    const userExist = await User.findOne({
        $or:[{username}, {email}]
    })

    if(userExist){
        throw new ApiError(401, "User already exists!")
    }

    let profilePictureLocalPath
    if (req.files && Array.isArray(req.files.profilePicture) && req.files.profilePicture.length){
        profilePictureLocalPath = req.files.profilePicture[0].path
    }

    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // now upload to cloudinary
    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    const user = await User.create({
        username:username,
        email:email,
        password:password,
        profilePicture:profilePicture?.url ||"",
        coverImage:coverImage?.url ||"",
    })

    const userCreated = await User.findById(user._id).select("-password")

    res.status(200).json({
        "message":"Registered Successfully!",
         userCreated
    })
}

const loginUser = async(req, res)=>{

    const {username, password} = req.body

    if([username,password].some(fields=> fields.trim()==="")) 
        throw new ApiError(400, "All fields are required")
    const user = await User.findOne({username})
    if(!user){
        throw new ApiError(401, "User does not exists")
    }
    const matchPassword = await user.isPasswordCorrect(password)

    if(!matchPassword){
        throw new ApiError(401, "Invalid credentials")
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
    const options = {
        httpOnly: true,
        secure: true
    }
    const loggedIn = User.findById(user._id).select("-password -refreshToken")
    res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        "message":"User logged In Successfully.",
        accessToken
    })

}


const logoutUser = async(req,res)=>{

    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        },
        new:true
    })

    const options = {
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV === "production"
    }

    res.clearCookie("accessToken",{options: options})
    res.clearCookie("refreshToken", {options: options})
    res.status(200).json({
        "message":"Logged out successfully"
    })
}


const updateProfilePicture = async(req,res)=>{
    const {profilePicturePath} = req.file?.path

    if (!profilePicturePath){
        throw new ApiError("Avatar File is Missing")
    }

    const pfp = await uploadOnCloudinary(profilePicturePath)

    if(!pfp){
        throw new ApiError("Avatar File Upload Failed")
    }

    await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            profilePicture:pfp.url
        },
        new:true
    })

    res.status(200).json({
        "message":"Profile Picture Updated Successfully"
    })
}

const changePassword = async(req,res)=>{

    const {oldPassword, newPassword, confirmPassword} = req.body

    const matchPassword = await req.user?._id.isPasswordCorrect(oldPassword)

    if(!matchPassword){
        throw new ApiError(400,"Old Password is Incorrect")
    }

    if(newPassword!==confirmPassword){
        throw new ApiError(400, "New password and confirm password does not match.")
    }

    await User.findByIdAndUpdate(
        req.user?._id,
        {

        }
    )
}

const getUserProfile = async(req, res)=>{

    // when we go the profile we usually get the data from the url
    const {username} = req.params
    if(!username.trim()){
        throw new ApiError(400, "Username is missing.")
    }

    const profile = await User.aggregate([
        {
            $match:{
                username:username
            }
        },
        {
            $lookup:{
                from:"stories",
                localField:"_id",
                foreignField:"author",
                as:"stories"
            }
        },
        {
            $lookup:{
                from:"follows",
                localField:"_id",
                foreignField:"follower",
                as:"following"
            }
        },
        {
            $lookup:{
                from:"follows", // db name 
                localField:"_id", // matching field of the current model 
                foreignField:"following", // matching field of the other model
                as:"follower"
            }
        },
        {
            $addFields:{
                followingCount:{
                    $size:"$following"
                },
                followerCount:{
                    $size:"$follower"
                },
                storiesCount:{
                    $size:"$stories"
                },
                isFollowing:{
                    $cond:{
                        if :{$in:[req.user?._id, "$following.following"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                username:1,
                email:1,
                profilePicture:1,
                coverImage:1,
                followingCount:1,
                followerCount:1,
                storiesCount:1,
                isFollowing:1,
                stories:1
            }
        }
    
    ])

    console.log(profile)
    if (!profile?.length){
        throw new ApiError(400, "Profile does not exist")
    }

    res.status(200).json({
        "message":"Profile fetched successfully",
        profile:profile[0]
    })
}

export {
    registerUser,
    loginUser,
    logoutUser,
    updateProfilePicture,
    changePassword,
    getUserProfile,
}