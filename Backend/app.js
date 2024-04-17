import express from "express";
import { config } from "dotenv";
import cors from 'cors'
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from './router/messageRouter.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'
import userRouter from './router/userRouter.js'
import appointmentRouter  from './router/appointmentRouter.js'

const app  = express();
config({path: "./config/config.env"});

 
// middleware to connect frontend 
app.use(cors({ 
    origin:[process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));

// middleware to get cookies 
app.use(cookieParser());
app.use(express.json());  //- parse json as string 
app.use(express.urlencoded({extended:true})) 
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
})) 

  
 
// Mount routers 

app.use("/api/v1/message",messageRouter);
app.use("/api/v1/user",userRouter) 
app.use("/api/v1/appointment",appointmentRouter) 
 

 

  
// connect the db 
dbConnection()
app.use(errorMiddleware);  // esako end me hi use krna hai

export default app;   