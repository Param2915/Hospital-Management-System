import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorHandler.js";
import {Appointment} from "../models/appointmentSchema.js";
import {User} from "../models/userSchema.js";



export const getAppointment = catchAsyncError(async (req, res, next) => {
  console.log("Received request body:", req.body); // Log the entire request body

  const {
    firstName,
    lastName,
    age,
    gender,
    email,
    phone,
    appointmentDate,
    doctor_firstName,
    doctor_lastName,
    depart,
    timeSlot,
  } = req.body;

  // Log each field to verify it was parsed correctly
  console.log("First Name:", firstName);
  console.log("Last Name:", lastName);
  console.log("Age:", age);
  console.log("Gender:", gender);
  console.log("Email:", email);
  console.log("Phone:", phone);
  console.log("Appointment Date:", appointmentDate);
  console.log("Time Slot:", timeSlot);
  console.log("Department:", depart);
  console.log("Doctor First Name:", doctor_firstName);
  console.log("Doctor Last Name:", doctor_lastName);

  // Validate required fields
  if (
    !firstName || !lastName || !age || !gender || !email || !phone ||
    !appointmentDate || !doctor_firstName || !doctor_lastName || !depart || !timeSlot
  ) {
    console.log("Validation error: Missing required fields.");
    return next(new ErrorHandler("Please provide all the details", 400));
  }

  // Convert age to a number and validate it
  const ageNumber = Number(age);
  if (isNaN(ageNumber) || ageNumber <= 0) {
    console.log("Validation error: Invalid age provided.");
    return next(new ErrorHandler("Invalid age. Please provide a valid number", 400));
  }

  // Process the doctor search
  const sanitizedDoctorFirstName = doctor_firstName.trim().toLowerCase();
  const sanitizedDoctorLastName = doctor_lastName.trim().toLowerCase();
  const sanitizedDepart = depart.trim().toLowerCase();

  const isConflict = await User.find({
    firstName: { $regex: new RegExp(sanitizedDoctorFirstName, "i") },
    lastName: { $regex: new RegExp(sanitizedDoctorLastName, "i") },
    role: "Doctor",
    doctorDepart: { $regex: new RegExp(sanitizedDepart, "i") },
  });

  if (isConflict.length === 0) {
    console.log("Doctor not found.");
    return next(new ErrorHandler("Doctor not found!", 404));
  }

  if (isConflict.length > 1) {
    console.log("More than one doctor found.");
    return next(
      new ErrorHandler(
        "More than one doctor found with the same details! Please use email or phone to identify the doctor",
        404
      )
    );
  }

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;

  const timeSlotConflict = await Appointment.find({
    doctorId,
    appointmentDate,
    timeSlot,
  });

  if (timeSlotConflict.length > 0) {
    console.log("Time slot is already booked.");
    return next(
      new ErrorHandler(
        "Time Slot is already booked! Please choose another time slot",
        400
      )
    );
  }

  const appointment = await Appointment.create({
    firstName,
    lastName,
    age: ageNumber, // Store age as a number
    gender,
    email,
    phone,
    appointmentDate,
    timeSlot,
    depart,
    doctor: {
      firstName: sanitizedDoctorFirstName,
      lastName: sanitizedDoctorLastName,
    },
    doctorId,
    patientId,
  });

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully!",
    appointment,
  });
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

  if (!email) {
      return next(new ErrorHandler("Email is required to find the appointment!", 400));
  }

  // Optional: Validate date format
  if (appointmentDate && !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) {
      return next(new ErrorHandler("Invalid date format. Please use YYYY-MM-DD.", 400));
  }

  const updateFields = {};
  if (appointmentDate) updateFields.appointmentDate = appointmentDate;
  if (status) updateFields.status = status;

  const appointment = await Appointment.findOneAndUpdate(
      { email },
      updateFields,
      {
          new: true,            
          runValidators: true,  
          useFindAndModify: false, 
      }
  );

  if (!appointment) {
      return next(new ErrorHandler("No appointment found with this email!", 404));
  }

  res.status(200).json({
      success: true,
      message: "Appointment Updated Successfully",
      appointment,
  });
});



  export const deleteAppointment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment Not Found!", 404));
    }
    await appointment.deleteOne();
    res.status(200).json({
      success: true,
      message: "Appointment Deleted!",
    });
  });