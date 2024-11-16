import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorHandler.js";
import {User} from "../models/userSchema.js";
import {generateToken} from "../utils/jwtMiddleware.js";

export const patientRegister = catchAsyncError(async(req,res,next)=>{
    const {firstName, lastName, email, phone, password, gender, age, role} = req.body;

    if(!firstName || !lastName || !email || !phone || !password || !gender || !age || !role){
        return next(new ErrorHandler("Please fill full form! ",400));
    }

    let user = await User.findOne({email});

    if(user){
        return next(new ErrorHandler("USER ALREADY REGISTERED! ",400))
    }
    user = await User.create({firstName, lastName, email, phone, password, gender, age, role});


    generateToken(user, "User Registered", 200, res)
})


export const patientLogin = catchAsyncError(async(req,res,next)=>{
    const {email,password,role}=req.body;

    if(!email || !password ||!role){
        return next(new ErrorHandler("Please provide the details",400))
    }

    const user = await User.findOne({email}).select("+password");
    
    if(!user) return next(new ErrorHandler("Invalid credentials",400)); 

    const passwordMatch = await user.comparePassword(password);
    if(!passwordMatch) return next(new ErrorHandler("Password did not match"),400);


    if(role!== user.role)return next(new ErrorHandler("User with this role not found"),400);

    generateToken(user, "Login Succesfull", 200, res)
})


export const adminRegister = catchAsyncError(async(req,res,next)=>{
    const { firstName, lastName, email, password, phone, gender, age}=req.body;

    if(!firstName || !lastName || !email || !phone || !password || !gender ||!age ){
        return next(new ErrorHandler("Please fill full form! ",400));
    }

    const isRegistered = await User.findOne({email});
    if(isRegistered) return next(new ErrorHandler(`${isRegistered.role} with this email already exists`))

    const admin = await User.create({firstName, lastName, email, password, phone, gender, age, role:"Admin"})

    res.status(200).json({
        success: true,
        message: "New Admin Registered"
    })
})


// export const getUserDetails = catchAsyncError(async(req,res,next)=>{

// })


export const adminLogOut = catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("adminToken","", {httpOnly: true, expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Admin LogOut Successfully"
    })
})


export const patientLogOut = catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("patientToken","", {httpOnly: true, expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "User LogOut Successfully"
    })
})



// module.exports = { patientRegister, patientLogin };