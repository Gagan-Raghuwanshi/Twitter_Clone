import express from "express";
import dotenv from "dotenv"
import DBconnection from "./DB/db.js"
import cookieParser from "cookie-parser"
import userRoute from "./routes/userRoute.js"
import tweetRoute from "./routes/tweet.route.js"
import cors from "cors"


// .env configration
dotenv.config({
    path:".env"
})

// DB function call
DBconnection();

// Express server is creating 
const app = express();

// middleware
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(cookieParser());

// CORS set up (whitelisting perticular Port for give permition to access from Backend server)

const corsOptions = {
    origin:"http://localhost:3000",
    credentials:true
}
app.use(cors(corsOptions))

// API's 
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet",tweetRoute);

 app.get("/home",(req,res)=>{
     res.status(201).json({
         message:"comming from backend",
         success:true
     })
 })

app.listen(process.env.PORT,()=>{
    console.log(`Server is Listen at port ${process.env.PORT} `)
})




//  04:48:02  Backend completed
