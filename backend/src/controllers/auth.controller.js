import { generateToken } from "../lib/utils.js";
import {User} from "../models/user.model.js";
import bcrypt, { hash } from "bcryptjs";

export const signup=async (req,res)=>{

    const {fullName, email, password}=req.body;
    try {
        //check if all the fields are present or not
        if(!fullName || !email || !password)
        {
            return res.status(400).json({message:"All Fields Are Required."});
        }
        //if password length is less than 6 characters
        if(password.length<6)
        {
            return res.status(400).json({message:"Password must be 6 characters."});
        }

        //check if user already exists or not
        const user=await User.findOne({email});
        if(user)
        {
            return res.status(400).json({message:"User already exists."});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new User({
            email,
            fullName,
            password:hashedPassword
        });

        if(newUser)
        {
            //generate jwt token here
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({User:{
                id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            },message:"User successfully registered."});
        }
        else
        {
            return res.status(400).json({message:"Invalid User Data."});
        }

    } catch (error) {
        console.log("Error in signup controller: ",error.message);
        return res.status(500).json({message:"Internal Server Error."});
    }
};

export const signin=async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await User.findOne({email});

        if(!user)
        {
            return res.status(400).json({message:"Invalid Credentials"});
        }

        //check if password is correct or not
        const isPasswordCorrect=await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect)
        {
            return res.status(400).json({message:"Ivalid Credentials."});
        }

        //now if password correct generate the tokens
        generateToken(user._id,res);
        
        res.status(201).json({User:{
            id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        },message:"User signed in."});

    } catch (error) {
        console.log("Error in signin controller: ",error.message);
        return res.status(500).json({message:"Internal Server Error."});
    }
};

export const signout=(req,res)=>{
    try {
        res.cookie("token","",{maxAge:0});
        res.status(400).json({message:"User Signed Out successfully."});
    } catch (error) {
        console.log("Error in signout controller: ",error.message);
        return res.status(500).json({message:"Internal Server Error."});
    }
};

export const updateProfile=async(req,res)=>{
    
}