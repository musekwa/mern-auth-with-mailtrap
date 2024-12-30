import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE_UUID } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendResetPasswordSuccessEmail = async (email) => {
    const recipients = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        })
        return response
    } catch (error) {
        console.error("Error sending reset password success email:", error)
        throw new Error("Error sending reset password success email", error)
    }
}

export const sendResetPasswordCodeEmail = async (email, resetURL) => {
    const recipients = [{ email }]
    try {
       const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password reset",
        })
       return response
    }
    catch(error){
        console.error("Error sending reset password email:", error)
        throw new Error("Error sending reset password email", error)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipients = [{ email }]
    try {
      const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: WELCOME_EMAIL_TEMPLATE_UUID,
            template_variables: {
                name: name,
                company_info_name: "TECMOZA"
            },
        })
        console.log("Welcome email sent successfully", response)
    }
    catch (error) {
        console.error("Error sending welcome email:", error)
        throw new Error("Error sending welcome email", error)
    }
}

export const sendVerificationEmail = async (email, verificationCode) => {
    const recipients = [{ email }]
    
    try {
        await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode),
            category: "Email Verification",
        })
        console.log("Verification email sent successfully")
    } catch (error) {
        console.error("Error sending verification email:", error)
        throw new Error("Error sending verification email", error)
    }
}