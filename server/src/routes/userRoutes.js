import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Only Super Admin (1) and Admin (2) can see the user list
router.get('/', authenticateToken, authorizeRole(1, 2), getAllUsers);

export default router;