import 'dotenv/config'
import {User} from "../models/userModel.js"
import jwt from 'jsonwebtoken'

export const isAuthenticated = async (req,resp,next)=>{
    try{
        const authHeader=req.headers.authorization
        
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return resp.status(400).json({
                success:false,
                message:"Authorization token is missing or invalid"
            })
        }
        const token= authHeader.split(" ")[1]
        let decoded;
        try{
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        }catch(error){
            if(error.name === "TokenExpiredError"){
                return resp.status(400).json({
                    success:false,
                    message:"The registration token has expired"
                })
            }
            return resp.status(400).json({
                success:false,
                message:"Access Token is missing or invalid"
            })
        }
        const user=await User.findById(decoded.id)
        if(!user){
            return resp.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        req.user=user
        req.id= user._id
        next()

    }catch(error){
        return resp.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const isAdmine=(req,resp,next)=>{
    if(req.user && req.user.role === 'admin'){
        next()
    }
    else {
        return resp.status(403).json
            ({
                message: "Access denied: admin only"
            })
    }
}