import express from "express";
import { patientRegister,adminRegister, adminLogOut, patientLogOut, addNewDoctor, getAllUsers, getAllDoctors, getUserDetails, login } from "../controllers/userController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/jwtAuthMiddleware.js";

const router = express.Router();

router.post("/patient/register", patientRegister)
router.post("/login", login)
router.post("/admin/register", isAdminAuthenticated,adminRegister)
router.get("/admin/logout", isAdminAuthenticated,adminLogOut)
router.get("/patient/logout",isPatientAuthenticated,patientLogOut)
router.post("/doctor/register",isAdminAuthenticated,addNewDoctor)
router.get("/allusers",isAdminAuthenticated,getAllUsers)
router.get("/alldoctors",isAdminAuthenticated,getAllDoctors)
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);


export default router;