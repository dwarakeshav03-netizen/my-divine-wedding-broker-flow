import { Router } from "express";
import { getAllStories, createStory, updateStory} from "../controllers/successStoriesController.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = Router();

// Anyone can see the success stories (Public)
router.get("/", getAllStories);

// Only Admins and Super admins can add new stories (Protected)
router.post("/", authenticateToken, authorizeRole('admin', 'super-admin'), createStory);

// Only Admins and Super admins can update EXIXSTING stories(Protected)
router.put("/:id", authenticateToken, authorizeRole('admin','super-admin'), updateStory);

export default router;