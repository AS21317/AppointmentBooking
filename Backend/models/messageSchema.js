import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
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

    phone:{

        // type ko string bnaya so that min and max ka validation lga ske 
        type:String,
        require:true,
        minLength:[10,"Phone number must cotain exactally 10 digit"],
        maxLength:[10,"Phone number must cotain exactally 10 digit"],

    }
    ,
    
    message:{

        // type ko string bnaya so that min and max ka validation lga ske 
        type:String,
        require:true,
        minLength:[10,"Message must cotain atleast 10 digit"],

    }
})

export const Message = mongoose.model("Message",messageSchema)