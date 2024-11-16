import { User } from "../models/userSchema.js";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./errorHandler.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncError(async(req,res,next)=>{
    const token = req.cookies.adminToken;
    if(!token) return next(new ErrorHandler("Admin NOT Authenticated"),400)

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user=await User.findById(decoded.id);

    //Authorization
    if(req.user.role!=="Admin") {
        return next(new ErrorHandler(`${req.user.role} is not Authorized for this`),403);
    }
    next();
})


export const isPatientAuthenticated = catchAsyncError(async(req,res,next)=>{
    const token = req.cookies.patientToken;
    if(!token) return next(new ErrorHandler("Admin NOT Authenticated"),400)

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user=await User.findById(decoded.id);

    //Authorization
    if(req.user.role!=="patient") {
        return next(new ErrorHandler(`${req.user.role} is not Authorized for this`),403);
    }
    next();
})