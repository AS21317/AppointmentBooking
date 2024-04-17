import { mongoose } from "mongoose";


export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("DB Connected Succssfully !! ");
    }).catch((err)=>{
        console.log("Errror in DB connection : ",err);
    })
}