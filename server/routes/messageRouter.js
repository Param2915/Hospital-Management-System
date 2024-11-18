import express from "express";
import { getAllMessages, sendMessage } from "../controllers/messageController.js";
import {isAdminAuthenticated} from "../middlewares/jwtAuthMiddleware.js"

const router = express.Router();

router.post("/send",sendMessage);
router.get("/allmessages",isAdminAuthenticated,getAllMessages)

export default router;