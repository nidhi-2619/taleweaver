import {DB_NAME} from "./../constants.js"
import mongoose from "mongoose"
const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(`${process.env.MONGO_URI}${DB_NAME}`, {
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}
export default connectDB;