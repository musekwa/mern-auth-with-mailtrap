
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: [true, "Email already exists"], trim: true, lowercase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"] },
    password: { type: String, required: [true, "Password is required"], select: false, minLength: [6, "Password must be at least 6 characters long"] },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    resetPasswordCode: String,
    resetPasswordCodeExpiresAt: Date,
    verificationCode: String,
    verificationCodeExpiresAt: Date,
}, { timestamps: true })

export default mongoose.model("User", userSchema)
