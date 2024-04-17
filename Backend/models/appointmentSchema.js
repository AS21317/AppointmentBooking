import mongoose, { Mongoose } from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        minLength:[3,"First name must contain at least 3 character"],
    },

    lastName:{
        type:String,
        require:true,
        minLength:[3,"Last name must contain at least 3 character"],
    },

    email:{
        type:String,
        require:true,
        validate:[validator.isEmail,"Please provide a valid Email"],
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female"],

    },

    phone:{

        // type ko string bnaya so that min and max ka validation lga ske 
        type:String,
        require:true,
        minLength:[10,"Phone number must cotain exactally 10 digit"],
        maxLength:[10,"Phone number must cotain exactally 10 digit"],

    },
    nic:{

        // type ko string bnaya so that min and max ka validation lga ske 
        type:String,
        require:true,
        minLength:[16,"Nic  must cotain exactally 10 digit"],
        maxLength:[16,"Nic  must cotain exactally 10 digit"],

    },
    
    appointment_date:{
        type:String,
        required:true,

    },
    department:{
        type:String,
        required:true
    },
    doctor:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        }

    },

    hasVisited:{
        type:Boolean,
        default:false
    },

    doctorId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    
   patientId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },

    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending"
    },

   
})


export const Appointment = mongoose.model("Appointment",appointmentSchema);
