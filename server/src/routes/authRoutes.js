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
import { seedDatabase, updateUniquePhones } from '../controllers/seedController.js';


const router = Router();

// Public routes
router.post("/register", authLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/refresh-token", authLimiter, refreshAccessToken);
router.post("/logout", logoutUser);
router.post('/update-phones', updateUniquePhones);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);

export default router;
