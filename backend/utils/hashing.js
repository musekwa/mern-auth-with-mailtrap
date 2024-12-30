
import bcrypt from "bcryptjs"
import crypto from "crypto"

export const hashPassword = async (password, saltRounds = 10)=>{
    return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password, hashedPassword)=>{
    return await bcrypt.compare(password, hashedPassword)
}

export const hmacProcess = async (data, secretKey)=>{
    return await crypto.createHmac("sha256", secretKey).update(data).digest("hex")
}

export const hmacCompare = async (data, hashedData, secretKey)=>{
    return await crypto.createHmac("sha256", secretKey).update(data).digest("hex") === hashedData
}
