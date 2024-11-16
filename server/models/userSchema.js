import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName:{
        type: String, 
        required: true, 
        minLength: [3,"First Name must contant atleast 3 characters!"]
    },
    lastName:{
        type: String, 
        required: true, 
        minLength: [3,"Last Name must contant atleast 3 characters!"]
    },
    email:{
        type: String, 
        required: true, 
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    phone:{
        type: String, 
        required: true, 
        minLength: [10,"Phone number must contain 10 digits"],
        maxLength: [10,"Phone number must contain 10 digits"]
    },
    age:{
        type: Number, 
        required: [true, "Age Is Required!"]
    },
    gender: {
        type: String, 
        required: true, enum: ["Male","Female","male","female"]
    },
    password: {
        type: String, 
        required: true, 
        minLength: [8, "Password must contain At least 8 Characters! "], 
        select: false
    },
    role: {
        type: String, 
        required: true, enum:["Admin","Patient","Doctor","admin","patient","doctor"]
    },
    doctorDepart:{
        type: String
    },
    docAvatar: {
        public_id: String, 
        url: String
    },
})

 userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
 });


 userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
 };

 userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    })
 }


export const User = mongoose.model("User",userSchema);