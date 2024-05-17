import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async(req, _, next)=>{

  try{
    // user can send access token in two ways
    // either by sending it in the headers or by sending it in the cookies
    const token = req.headers.authorization.split(" ")[1] || req.cookies?.accessToken
    if(!token){
        throw new ApiError(401, "Unauthorized Request")
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select("-password -refreshToken")

    if(!user){

      throw new ApiError(401, "Invalid Access Token")
    }
    req.user = user
    next()
  }
  catch(err){
    throw new ApiError(401, "Unauthorized Request")
  }
}