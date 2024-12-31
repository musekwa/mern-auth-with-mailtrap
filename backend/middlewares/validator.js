import Joi from "joi"

export const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(1).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')),
})

export const verifyEmailSchema = Joi.object({
    verificationCode: Joi.string().required().length(6),
})

export const signinSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(1).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')),
})

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
})

export const resetPasswordSchema = Joi.object({
    password: Joi.string().min(1).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')),
})
