import { Router } from "express";
import {
  createProfile,
  getProfile,
  searchProfiles,
  getPendingProfiles,
  verifyProfile,
  getAdminStats
} from "../controllers/profileController.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = Router();

// * Public/General Routes *
router.get("/search", searchProfiles);

// * User Protected Routes *
router.post("/", authenticateToken, createProfile);
router.get("/me", authenticateToken, getProfile);

// * Admin Only Routes *
router.get("/admin/stats", authenticateToken, authorizeRole('admin', 'super-admin'), getAdminStats);
router.get("/admin/pending", authenticateToken, authorizeRole('admin', 'super-admin'), getPendingProfiles);
router.patch("/admin/verify/:profileId", authenticateToken, authorizeRole('admin', 'super-admin'), verifyProfile);

export default router;