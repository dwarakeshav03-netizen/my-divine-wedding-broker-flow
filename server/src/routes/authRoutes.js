import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
<<<<<<< HEAD
  addAdminBySuperAdmin,
  requestLoginCode,
  verifyPhoneCode
=======
  
>>>>>>> 694927c (Fix auth and profile controllers and routes)
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
<<<<<<< HEAD
router.post('/add-admin', authenticateToken, authorizeRole(1), addAdminBySuperAdmin);
router.post('/seed-database', seedDatabase);
router.post('/request-code', requestLoginCode);
router.post('/verify-code', verifyPhoneCode);
=======
>>>>>>> 694927c (Fix auth and profile controllers and routes)


// Protected routes
router.get("/me", authenticateToken, getCurrentUser);

export default router;
