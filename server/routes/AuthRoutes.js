import { Router } from "express";
import { login, changePassword, verifySecurityCode, forgotPassword } from "../controller/AuthController.js";
import verifyToken from "../middlewares/AuthMiddleware.js";

const authRoutes = Router();

// Login route
authRoutes.post("/login", login);

// Route to verify security code for admin and faculty
authRoutes.post("/verify-security-code", verifySecurityCode);

// Change password route
authRoutes.post("/change-password", verifyToken, changePassword);

authRoutes.post("/forgot-password", forgotPassword);

// Protected route to get user data
// authRoutes.get("/user-info", verifyToken, getUser);

export default authRoutes;
