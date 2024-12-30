import mongoose from "mongoose"
export const connectDB = async ()=>{
    try {
       const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error: ", error)
        process.exit(1) // Exit the process with a failure code
    }
}