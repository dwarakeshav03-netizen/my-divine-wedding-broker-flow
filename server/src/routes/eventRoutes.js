import { Router } from "express";
import { createEvent, getEvents } from "../controllers/eventController.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";

const router = Router();

// Only Admins managing events
router.post("/", authenticateToken, authorizeRole('admin'), createEvent);
router.get("/", authenticateToken, authorizeRole('admin'), getEvents);

export default router;