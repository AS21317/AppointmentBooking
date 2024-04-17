import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { config } from "dotenv";
config({path: "./config/config.env"});


const userSchema = new mongoose.Schema({
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
    
    nic:{

        // type ko string bnaya so that min and max ka validation lga ske 
        type:String,
        require:true,
        minLength:[16,"Nic  must cotain exactally 16 digit"],
        maxLength:[16,"Nic  must cotain exactally 16 digit"],

    },

    dob:{
        type:Date,
        required:[true,"DOB is required "],

    },

    gender:{
        type:String,
        required:true,
        enum:["Male","Female"],

    },

    password:{
        type:String,
        minLength:[8,"Password must contain atleast 8 character"],
        required:true,
        select:false,   // means jb bhi db se user fetch krenge to password select nhi hoga 
    },

    role:{
        type:String,
        enum:["Admin","Patient","Doctor"],
    },

    doctorDepartment:{
        type:String,
    },
    docAvatar:{
        public_id:String,
        url:String
    },


    
})



// using premiddleware of mongo db to encrypt pass and generate token

userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
    {
        next();
    }

 this.password = await bcrypt.hash(this.password,10);
})

// now define some methods on userSchema 

userSchema.methods.comparePassword = async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password);
}

userSchema.methods.generateJsonWebToken = function ()
{
    return jwt.sign({id:this._id},process.env.JWT_SECTRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES,
    })
}

export const User = mongoose.model("User",userSchema)