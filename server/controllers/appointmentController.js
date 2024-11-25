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


export const getAllAppointments = catchAsyncError(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
      success: true,
      appointments,
    });
  });



  export const updateAppointmentStatus = catchAsyncError(async (req, res, next) => {
    const { email, appointmentDate, status } = req.body;

    // Validate required input
    if (!email) {
        return next(new ErrorHandler("Email is required to find the appointment!", 400));
    }

    // Build the update object dynamically based on the provided fields
    const updateFields = {};
    if (appointmentDate) updateFields.appointmentDate = appointmentDate;
    if (status) updateFields.status = status;

    // Find and update the appointment by email
    const appointment = await Appointment.findOneAndUpdate(
        { email },
        updateFields,
        {
            new: true,            // Return the updated document
            runValidators: true,  // Validate the updated fields
            useFindAndModify: false, // Ensure compatibility with the latest Mongoose
        }
    );

    // If no appointment is found, return an error
    if (!appointment) {
        return next(new ErrorHandler("No appointment found with this email!", 404));
    }

    // Send the updated appointment in the response
    res.status(200).json({
        success: true,
        message: "Appointment Updated Successfully",
        appointment,
    });
});
