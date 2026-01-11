import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticateToken,authorizeRole } from "../middleware/auth.js";
import { loginLimiter, authLimiter } from "../middleware/rateLimiter.js";


const router = Router();

// Public routes
router.post("/register", authLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/refresh-token", authLimiter, refreshAccessToken);
router.post("/logout", logoutUser);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);

export default router;
