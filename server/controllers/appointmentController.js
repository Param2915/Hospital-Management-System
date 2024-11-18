import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorHandler.js";
import {Appointment} from "../models/appointmentSchema.js";
import {User} from "../models/userSchema.js";


export const getAppointment = catchAsyncError(async(req,res,next)=>{
    const {firstName, lastName, age, gender, email, phone, appointmentDate, doctor_firstName, doctor_lastName, depart} = req.body;

    if(!firstName || !lastName || !age || !gender || !email || !phone || !appointmentDate || !doctor_firstName || !doctor_lastName || !depart ){
        return next(new ErrorHandler("Please provide all the details"),400)
    }

    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "doctor",
        doctorDepart: depart,
    })

    if(isConflict.length === 0) return next(new ErrorHandler("Doctor not found!"),404)
    
    if(isConflict.length > 1) return next(new ErrorHandler("More than one doctors with same details!  Please find through email or phone"),404)

    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;
    const appointment = await Appointment.create({firstName, lastName, age, gender, email, phone, appointmentDate, 
        doctor:{
        firstName: doctor_firstName,
        lastName: doctor_lastName
    }, depart, doctorId, patientId})



    res.status(200).json({
        success: true,
        message: "Appointment Successfull"
    })
});