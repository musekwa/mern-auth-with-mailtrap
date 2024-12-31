import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./db/connectDB.js"
import authRoutes from "./routes/auth.route.js"
import path from "path"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const __dirname = path.resolve()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}


app.listen(PORT, ()=>{
    // Connect to MongoDB
    connectDB()
    console.log(`Server running on Port: ${PORT}`)
})