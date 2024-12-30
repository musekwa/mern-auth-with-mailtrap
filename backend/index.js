import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { connectDB } from "./db/connectDB.js"
import authRoutes from "./routes/auth.route.js"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)

app.listen(PORT, ()=>{
    console.log(`Server running on Port: ${PORT}`)
})