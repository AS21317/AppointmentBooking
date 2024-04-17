import express from "express";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";
import { deleteAppointment, getAllAppointments, postAppointment, updateAppointmentStatus } from "../controller/appointmentController.js";

const router = express.Router();

router.post('/post',isPatientAuthenticated,postAppointment)  //appontmetn only register patient hi send kr skte hai by isUserAuthinticated
router.get('/getAllAppointments',isAdminAuthenticated,getAllAppointments)
router.put('/update/:id',isAdminAuthenticated,updateAppointmentStatus)  //appontmetn status only register patient hi send kr skte hai by isUserAuthinticated
router.delete('/deleteAppointment/:id',isAdminAuthenticated,deleteAppointment)

export default router;   