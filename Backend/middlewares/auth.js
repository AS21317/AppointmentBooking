// admin ko only admin hi add kr paye and authentication proper ho paye 
// all the above fnxality is written here 

import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncErrors(async(req,res,next)=>{

    // hr req ke sath admin and patient dono ke token aayange , we will use acc to need 
    const token  = req.cookies.adminToken;  // admin ke system se cookie storage me se admin token  req me aayaga

    // console.log("admin and patient cookies : ", req.cookies.adminToken,req.cookies.patientToken);

    if(!token)
    {
        return next(new ErrorHandler("Admin not Authorized !"))
    }

    // *======>> Authentication 
    const decoded_token = jwt.verify(token,process.env.JWT_SECTRET_KEY);
    //since we have used _id attribute of user to generate token to send in cookie
    // thats why -> this decoded token will contain the mongo db id of user 

    req.user = await User.findById(decoded_token.id);
     //middleware  authentication ke baad req.user me Admin ki details aa jayegi 


    //* ------> Autherization
    if(req.user.role !== "Admin")
    {
        return next(new ErrorHandler(`${req.user.role} is not authorized for this request `,403));
    }

    next();
})



// Patient Authenticated 

export const isPatientAuthenticated = catchAsyncErrors(async(req,res,next)=>{

    const token  = req.cookies.patientToken;  // admin ke system se cookie storage me se admin token  req me aayaga

    if(!token)
    {
        return next(new ErrorHandler("Patient not Authorized !"))
    }

    // *======>> Authentication 
    const decoded_token = jwt.verify(token,process.env.JWT_SECTRET_KEY);
    //since we have used _id attribute of user to generate token to send in cookie
    // thats why -> this decoded token will contain the mongo db id of user 

    req.user = await User.findById(decoded_token.id);  //middleware  authentication ke baad req.user me patient ki details aa jayegi 



    //* ------> Autherization
    if(req.user.role !== "Patient")
    {
        return next(new ErrorHandler(`${req.user.role} is not authorized for this request `,403));
    }

    next();
})