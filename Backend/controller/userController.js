import { catchAsyncErrors} from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../middlewares/errorMiddleware.js' 
import { User } from '../models/userSchema.js';
import { generateToken } from '../utils/JwtToken.js';
import cloudinary from "cloudinary"

export const patientRegister = catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,gender,nic,dob,phone,password} = req.body;

    if(!firstName || !lastName || !email || !gender || !nic || !dob || !phone   || !password)
    {
        return next(new ErrorHandler("Please fill all Patient  details ",400));
    }

    let user = await User.findOne({email});

    if(user)
    {
        return next(new ErrorHandler("User already register ",400));

    }

    user = await User.create({
        firstName,lastName,email,gender,nic,dob,phone,role:"Patient",password
        
    });

    // if user is successfully registered , we need to generate token for user for future authentication and authorization
    console.log(user);

    generateToken(user,"User Registered Successfullr ",200,res)

//    return res.status(200).json({
//         success:true,
//         message: "User Regisgtered",
//         userDetails: user
//     })

})


// ->  Login controllers

export const login = catchAsyncErrors(async function(req,res,next){
    const {email,password,confirmPassword,role} = req.body;

    console.log("recieved info : ",email,password,confirmPassword,role );

    if(!email || !password || !confirmPassword || !role)
    {
        return next(new ErrorHandler("Please fill the Login form Completely",400));
    }

    if(password !== confirmPassword)
    {
        return next(new ErrorHandler("password and Confirm password Do not match",400));

    }
 
    const user = await User.findOne({email}).select("+password"); // select use krne se db se user ka password bhi select kr sakte hai jo ki bydefault schema me select false hone kr karan nonselectable hai 

    if(!user)
    {
        return next(new ErrorHandler("Invalid Password or Email",400));

    }

 
    // if user found lets match the password 
    // schema me defined all methods user me available hai , just call them on schema

    const ispasswordMatched = await user.comparePassword(password) 
    if(!ispasswordMatched){
        return next(new ErrorHandler("Invalid Password or Email",400));

    }

  
    if(role !== user.role)
    {
        return next(new ErrorHandler("User with this Role not found",400));

    }
   

    console.log("Passed all constraits , you are a true user ");

    generateToken(user,"User Login Successfully ",201,res)

})    


// * FUNCTION TO add new Admin in the system

export const addNewAdmin = catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,gender,nic,dob,phone,password,} = req.body;

    if(!firstName || !lastName || !email || !gender || !nic || !dob || !phone || !password)
    {
        return next(new ErrorHandler("Please fill all   details ",400));
    }

    const isRegistered = await User.findOne({email})
    if(isRegistered)
    {
        return next(new ErrorHandler("User with this email already exist  ",400));

    }
    const admin = await User.create({firstName,lastName,email,gender,nic,dob,phone,role: "Admin",password,})

    res.status(200).json({
        success:true,
        message:"New Admin Registered !"
    })
})



// Get all DOCTORS 

export const getAllDoctors = catchAsyncErrors(async(req,res,next)=>{
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        message:"List of all doctors :",
        doctors
    })
})



// get all users 

export const getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = req.user; // after authentication req.user me user aa jayega 
    res.status(200).json({
        success:true,
        message:"Following are the user Details :",
        user
    })
})


// Logout Admin 

export const adminLogout = catchAsyncErrors(async(req,res,next)=>{
    // logout krte time cookie ko fronend se expire kr do 
    res.status(200).cookie("adminToken","",{
        httpOnly:true,
        expires:new Date(new Date())
    }).json({
        success:true,
        message:"Admin Logged  Out Successfully !! "
    })
})



// Logout Patient 

export const patientLogout = catchAsyncErrors(async(req,res,next)=>{
    // logout krte time cookie ko fronend se expire kr do 
    res.status(200).cookie("patientToken","",{
        httpOnly:true,
        expires:new Date(new Date())
    }).json({
        success:true,
        message:"Patient Logged Out Successfully !! "
    })
})



// Add new Doctor 
 export const addNewDoctor = catchAsyncErrors(async(req,res,next)=>{
    // check validation for doctor avatar

    console.log("yha hu");
    if(!req.files || Object.keys(req.files).length === 0)
    {
        return next(new ErrorHandler("Doctor avatar Required !",400));
    }

    const {docAvatar} =req.files;
    const allowedFormat = ["image/png","image/jpg","image/jpeg","image/webp"]; 

    if(!allowedFormat.includes(docAvatar.mimetype))
    {
        return next(new ErrorHandler("File format not supported !!",400))
    }

    const {firstName,lastName,email,gender,nic,dob,phone,role,password,doctorDepartment} = req.body;

    if(!firstName || !lastName || !email || !gender || !nic || !dob || !phone ||  !password || !doctorDepartment)
    {
        return next(new ErrorHandler("Please fill all Patient  details ",400));
    }

    const isRegistered = await User.findOne({email});
    console.log("Is register details  : ",isRegistered);

    if(isRegistered)
    {
        return next(new ErrorHandler(`A ${isRegistered.role} already Exist with ${email} `));
    }

// Post this image on cloudinary 
const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
 
if(!cloudinaryResponse || cloudinaryResponse.error)
{
    console.error("Cloudinary Error",cloudinaryResponse.error || "Unknown cloudinary error")
}

// Now create a new doctor in database 
const doctor = await User.create({
    firstName,lastName,email,gender,nic,dob,phone,role:"Doctor",password,doctorDepartment,
    docAvatar:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url,

    },

})
    res.status(200).json({
        success:true,
        message:"new Doctor Register with following details: ",
        doctor

    })
 })