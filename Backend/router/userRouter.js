import express from "express";
import {  addNewAdmin, addNewDoctor, adminLogout, getAllDoctors, getUserDetails, login, patientLogout, patientRegister } from "../controller/userController.js";
import { isAdminAuthenticated,isPatientAuthenticated } from "../middlewares/auth.js";

const router   = express.Router();

router.post("/patient/register",patientRegister);
router.post("/login",login); 
router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin); 
router.get("/doctors",getAllDoctors); 
router.get("/admin/me",isAdminAuthenticated,getUserDetails);   // middleware are here to authenticate admin
router.get("/patient/me",isPatientAuthenticated,getUserDetails);  // middleware are here to authenticate admin 
router.get("/admin/logout",isAdminAuthenticated,adminLogout);
router.get("/patient/logout",isPatientAuthenticated,patientLogout);
router.post("/doctor/addNew",isAdminAuthenticated,addNewDoctor);  // doctor ko only admin hi add kr sakta hai 



export default router;   