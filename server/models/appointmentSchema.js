import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const appointmentSchema = new mongoose.Schema({
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
        required: true, 
        enum: ["Male","Female","male","female"]
    },
    appointmentDate: {
        type: String,
        required: true
    },
    depart: {
        type: String,
        required: true
    },
    doctor:{
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        }
    },
    doctorId:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    patientId:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    status:{
        type: String,
        enum: ["pending","Pending","Accepted","accepted","Rejected","rejected"],
        default:"pending"
    }
})

export const Appointment = mongoose.model("Appointment",appointmentSchema);