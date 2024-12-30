import crypto from 'crypto'
import User from "../models/user.model.js"
import { hashPassword, hmacProcess, hmacCompare, comparePassword } from "../utils/hashing.js"
import { forgotPasswordSchema, resetPasswordSchema, signinSchema, signupSchema, verifyEmailSchema } from "../middlewares/validator.js"
import { generateJWTokenAndSetCookie } from "../utils/generateJWTokenAndSetCookie.js"
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordCodeEmail, sendResetPasswordSuccessEmail } from "../mailtrap/emails.js" 

export const checkAuth = async (req, res)=>{
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({success:false,message:"User not found"})
        }
        res.status(200).json({success:true,message:"Authenticated",user})
    } catch (error) {
        console.error("Error in checkAuth",error)
        res.status(500).json({success:false,message:"Internal server error",error:error.message})
    }
}

export const resetPassword = async (req, res)=>{
    const {token} = req.params
    const {password} = req.body
    try {
        const {error} = resetPasswordSchema.validate({password})
        if(error){
            return res.status(400).json({success:false,message:error.details[0].message})
        }
        const existingUser = await User.findOne({resetPasswordCode:token, resetPasswordCodeExpiresAt:{$gt: Date.now()}})
        if(!existingUser){
            return res.status(404).json({success:false,message:"Invalid or expired reset password code"})
        }
        existingUser.password = await hashPassword(password)
        existingUser.resetPasswordCode = undefined
        existingUser.resetPasswordCodeExpiresAt = undefined
        await existingUser.save()
        await sendResetPasswordSuccessEmail(existingUser.email)
        res.status(200).json({success:true,message:"Password reset successful"})
    } catch (error) {
        console.log("Error in resetPassword",error)
        res.status(500).json({success:false,message:"Internal server error",error:error.message})

    }
}

export const forgotPassword = async (req, res)=>{
    const {email} = req.body
    try {
        const {error} = forgotPasswordSchema.validate(req.body)
        if(error){
            return res.status(400).json({success:false,message:error.details[0].message})
        }
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(404).json({success:false,message:"User not found"})
        }
        const resetPasswordCodeExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
        const resetPasswordCode = crypto.randomBytes(20).toString('hex')
       
        existingUser.resetPasswordCode = resetPasswordCode
        existingUser.resetPasswordCodeExpiresAt = resetPasswordCodeExpiresAt
        await existingUser.save()
        await sendResetPasswordCodeEmail(existingUser.email, `${process.env.CLIENT_URL}/reset-password?code=${resetPasswordCode}`)
        res.status(200).json({success:true,message:"Reset password code sent to email"})
        
    }
    catch(error){
        console.log("Error in forgotPassword",error)
        res.status(500).json({success:false,message:"Internal server error",error:error.message})
    }
}

export const verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body
    try {
        const { error } = verifyEmailSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message })
        }
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        const isVerified = await hmacCompare(verificationCode, existingUser.verificationCode, process.env.HMAC_SECRET_KEY)
        // Check if verification code is invalid or expired
        // isVerified will be false if the code doesn't match the stored HMAC
        // verificationCodeExpiresAt < new Date() checks if the 24 hour window has passed
        if (!isVerified || existingUser.verificationCodeExpiresAt < new Date()) {
            return res.status(400).json({ success: false, message: "Invalid verification code" })
        }
        existingUser.isVerified = true
        existingUser.verificationCode = undefined
        existingUser.verificationCodeExpiresAt = undefined
        await existingUser.save()
        await sendWelcomeEmail(existingUser.email, existingUser.name)
        res.status(200).json({ success: true, message: "Email verified successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

export const signup = async (req, res) => {
    const { name, email, password } = req.body

    try {
        if (!name || !email || !password) {
            throw new Error("All fields are required")
        }
        const { error } = signupSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message })
        }
        const existingUser = await User.findOne({ email }).select("+password")
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }
        const hashedPassword = await hashPassword(password) // hash the password
        const verificationCodeExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString() // 6 digit verification code
        const hmacVerificationCode = await hmacProcess(verificationCode, process.env.HMAC_SECRET_KEY)
        if (existingUser && !existingUser.isVerified) {
            existingUser.name = name
            existingUser.email = email
            existingUser.password = hashedPassword
            existingUser.verificationCode = hmacVerificationCode
            existingUser.verificationCodeExpiresAt = verificationCodeExpiresAt
            await existingUser.save()
            // jwt
            const token = generateJWTokenAndSetCookie(res, existingUser._id)

            // send verification email
            await sendVerificationEmail(existingUser.email, verificationCode)
            return res.status(200).json({ success: true, message: "User updated successfully", token, user: existingUser })
        }
        else {
            const newUser = new User({ name, email, password: hashedPassword, verificationCode: hmacVerificationCode, verificationCodeExpiresAt })
            const savedUser = await newUser.save()
            const token = generateJWTokenAndSetCookie(res, savedUser._id)
            await sendVerificationEmail(savedUser.email, verificationCode)
            return res.status(201).json({ success: true, message: "User created successfully", token, user: savedUser })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body
    try {
        const { error } = signinSchema.validate(req.body)
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message })
        }
        const existingUser = await User.findOne({ email }).select("+password")
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        const isPasswordCorrect = await comparePassword(password, existingUser.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid password" })
        }
        const token = generateJWTokenAndSetCookie(res, existingUser._id)
        existingUser.lastLogin = new Date()
        await existingUser.save()
        res.status(200).json({ success: true, message: "Login successful", token, user: existingUser })
    } catch (error) {
        console.log("Error in signin", error)
        res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logout successful" })
}
