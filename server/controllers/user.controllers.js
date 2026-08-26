import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const getCurrentUser=async (req,res)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({user:null})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        return res.json(user)
    } catch (error) {
        // Just return null if token is invalid or expired
        return res.json({user:null})
    }
}
