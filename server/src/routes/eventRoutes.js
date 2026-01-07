import { Router } from "express";
import { createEvent, getEvents, updateEvent } from "../controllers/eventController.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// Only Admins managing events
router.post("/", authenticateToken, authorizeRole('admin'), createEvent);
router.post("/", authenticateToken, authorizeRole('admin'), upload.single('event_photo'), createEvent);
router.get("/", authenticateToken, getEvents);
router.put("/:id", authenticateToken, authorizeRole('admin', 'super-admin'), upload.single('event_photo'),updateEvent);

export default router;