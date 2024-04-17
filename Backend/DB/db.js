import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config({
    path:"../DB/.env"
})


const DBconnection =async ()=>{
// we can connect our DB using two ways, either using Promises or Async-Await

    // mongoose.connect(process.env.MONGO_URI).then(()=>{
    //     console.log("connected to mongoDB ");
    // }).catch((error)=>{
    //     console.log("Unable to connect DB",error);
    // })

    try {
        const DB = await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to mongoDB")
    } catch (error) {
        console.log(error)
    }
}
export default DBconnection;