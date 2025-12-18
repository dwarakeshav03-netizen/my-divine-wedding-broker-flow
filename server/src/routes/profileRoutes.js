import { Router } from "express";
import {
  createProfile,
  updateProfile,
  getProfile,
  getProfileById,
  searchProfiles,
} from "../controllers/profileController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Protected routes
router.post("/", authenticateToken, createProfile);
router.put("/", authenticateToken, updateProfile);
router.get("/me", authenticateToken, getProfile);
router.get("/search", searchProfiles);
router.get("/:profileId", getProfileById);

export default router;
