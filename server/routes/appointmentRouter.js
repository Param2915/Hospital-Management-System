import express from "express";
import { getAppointment } from "../controllers/appointmentController.js";
import { isPatientAuthenticated } from "../middlewares/jwtAuthMiddleware.js";

const router = express.Router();

router.post("/new",isPatientAuthenticated,getAppointment);

export default router;