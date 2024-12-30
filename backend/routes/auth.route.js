
import express from "express"
import { signup, signin, logout, verifyEmail, forgotPassword, resetPassword, checkAuth } from "../controllers/auth.controller.js"
import { verifyJWT } from "../middlewares/verifyJWT.js"

const router = express.Router()

router.get("/check-auth", verifyJWT, checkAuth)

router.post("/signup", signup)
router.post("/login", signin)
router.get("/logout", logout)
router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

export default router
