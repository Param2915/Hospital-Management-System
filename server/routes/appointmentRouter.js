import express from "express";
import { getAllAppointments, getAppointment, updateAppointmentStatus } from "../controllers/appointmentController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/jwtAuthMiddleware.js";

const router = express.Router();

router.post("/new",isPatientAuthenticated,getAppointment);
router.get("/getall", isAdminAuthenticated,getAllAppointments);
router.put("/update", isAdminAuthenticated, updateAppointmentStatus);



export default router;