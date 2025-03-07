import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const protectRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        //check if token provied or not
        if(!token)
        {
            return res.status(401).json({message:"Unauthorized-No Token Provided."});
        }
        //decode the token payload and find the user
        const decoded=await jwt.verify(token, process.env.JWT_SECRET);
        //if decoded is a null value
        if(!decoded)
        {
            return res.status(401).json({message:"Unauthorized: Invalid Token."});
        }
        //find the user from the database based on the userId fetched from decoding the token
        const user=await User.findById(decoded.userId).select("-password");
        //check if user exists or not with that userId
        if(!user)
        {
            return res.staus(404).json({message:"User not found."});
        }
        //now put the user in the request object
        req.user=user;
        next();

    } catch (error) {
        console.log("Error in protectRoute Middleware.",error.message);
        return res.status(500).json({message:"Internal server error."});
    }
};