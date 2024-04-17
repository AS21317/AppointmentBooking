import express from "express";
import { getAllMessage, sendmessage } from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post('/send',sendmessage)
router.get('/getAll',isAdminAuthenticated,getAllMessage)  // message can only be seen by admin

export default router; 