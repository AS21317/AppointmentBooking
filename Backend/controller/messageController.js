import { Message } from "../models/messageSchema.js";
import {catchAsyncErrors} from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../middlewares/errorMiddleware.js'

export const  sendmessage = catchAsyncErrors( async (req,res,next)=>{
    console.log("jodss");
    const {firstName,lastName,email,phone,message} = req.body;

    if(!firstName || !lastName || !email || !phone || !message)
    {
        console.log("here i am ");
       return next( new ErrorHandler("Please fill the full form ",400))  // here we are creating our error object with the help of Errorhandler
        
    }
 
    await Message.create({firstName , lastName,email,phone,message})
    res.status(200).json({
        success:true,
        message:"Message Send Successfully ",
    }) 

} )

// Get all message 
// Only   Admin can see all the messages --> thats why put isAdminAuthentication before router access
export const getAllMessage = catchAsyncErrors(async(req,res,next)=>{

    const messages = await Message.find();
    res.status(200).json({
        success:true,
        message:"Messages are displayed below ",
        messages
    })
})