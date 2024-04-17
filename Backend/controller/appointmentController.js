import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler, { errorMiddleware } from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
email,
    gender,
    phone,
    nic,
appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
hasVisited,
address,
   
  } = req.body;

  console.log("Recieved info : ",req.body);

  if( !firstName || !lastName || !email || !gender || !phone || !nic || !appointment_date || !department || !doctor_firstName || !doctor_lastName ||  !address)
  {
    return next(new ErrorHandler("Please fill all details !!",400));
  }

//   Check that requested doctor exist or not 
 const isconflict = await User.find({
    // firstName: doctor_firstName,  //* First name se qurey kyo nhi ho rhi hai ?? 
    lastName: doctor_lastName,
    role:"Doctor", 
    doctorDepartment:department,
    // firstName:doctor_firstName
 })

 console.log("COnflict is : ",isconflict);

 if(isconflict.length === 0){
    return next(new ErrorHandler("Doctor does not Exist",400));

 }
 // check conflict if two doctor has same name 
 if(isconflict.length >1){
    return next(new ErrorHandler("Doctor Conflict ,Please contact through Email or Phone",400));

 }

//  How to get the doctorid and PatientId

const doctorId = isconflict[0]._id;
const patientId = req.user._id;  //request whi send kr skta hai jo patient hai and authorized hai 

const appointment = await Appointment.create({
    firstName,
    lastName,
email,
    gender,
    phone,
    nic,
appointment_date,
    department,
    doctor:{
        firstName:doctor_firstName,
        lastName: doctor_lastName,
    },
    
   
hasVisited,
address,
doctorId,
patientId,

});

res.status(200).json({
    success:true,
    message:"Appointment Sent Successfully!"
})




});


export const getAllAppointments = catchAsyncErrors(async(req,res,next)=>{
    const appointments = await Appointment.find();

    res.status(200).json({
        success:true,
        message: "Following are your appointments ",
        appointments
    })
})


export const updateAppointmentStatus = catchAsyncErrors(async(req,res,next)=>{
    // frontend se appointment ki id as a params aayegi 
    const {id} = req.params;
    try{
       
        let appointment = await Appointment.findById(id);
        if(!appointment)
        {
            return next(new ErrorHandler("Appointment  not found",404))
        }
        
    }
    catch(err)
    {
       
        {
            
            return next(new ErrorHandler("Appointment not found",404))
        }
    }


   let appointment = await Appointment.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true, 
        useFindAndModify:false
        // ? ====>> Why these threee
    })

    res.status(200).json({
        success:true, 
        message:"Appointment status updated ",
        appointment 
    }) 
 

})


// Delete an appointment 

export const deleteAppointment = catchAsyncErrors(async(req,res,next)=>{
    let appointment;
    try{
        const {id} = req.params;
         appointment = await Appointment.findById(id);
         if(!appointment)
         {
             return next(new ErrorHandler("Appointment ID is  not Valid",404))
         }
         
  
    }
    catch(err)
    {
       
        {
            
            return next(new ErrorHandler("Appointment not found",404))
        }
    }
    await appointment.deleteOne();
    res.status(200).json({
        success:true,
        message:"Appointment Deleted"
    })


   

    

})
