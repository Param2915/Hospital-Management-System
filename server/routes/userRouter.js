import express from "express";
import { patientLogin, patientRegister,adminRegister, adminLogOut, patientLogOut, addNewDoctor, getAllUsers } from "../controllers/userController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/jwtAuthMiddleware.js";

const router = express.Router();

router.post("/patient/register", patientRegister)
router.post("/login", patientLogin)
router.post("/admin/register", isAdminAuthenticated,adminRegister)
router.get("/admin/logout", isAdminAuthenticated,adminLogOut)
router.get("/patient/logout",isPatientAuthenticated,patientLogOut)
router.post("/doctor/register",isAdminAuthenticated,addNewDoctor)
router.get("/allusers",isAdminAuthenticated,getAllUsers)



export default router;