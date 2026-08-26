import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
const isAuth=async (req,res,next)=>{
try {
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({message:"unauthorized"})
    }
     const decoded=jwt.verify(token,process.env.JWT_SECRET)
     req.user=await User.findById(decoded.id)
     next()
} catch (error) {
    return res.status(500).json({message:"invalid token"})
}
}

export default isAuth
