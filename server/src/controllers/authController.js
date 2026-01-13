import { executeQuery } from "../config/database.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { generateTokens } from "../utils/tokenManager.js";
import { v4 as uuidv4 } from "uuid";


const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  USER: 3
};

export const loginUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Request body is missing" });
    }
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const users = await executeQuery(
      "SELECT id, email, password, role, status FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = users[0];

    const isPasswordValid = await comparePassword(password, user.password);
    const isPlainTextMatch = (password === user.password);

    if (!isPasswordValid && !isPlainTextMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        userId: user.id,
        email: user.email,
        role: user.role, 
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    
    const userId = req.user?.userId || req.user?.id;
    
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const users = await executeQuery(
      "SELECT id, firstName, email, role, status FROM users WHERE id = ?", 
      [userId]
    );
    
    if (users.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: users[0] });
  } catch (error) { 
    console.error("Get Current User Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" }); 
  }
};


export const addAdminBySuperAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role_id } = req.body;
    const existing = await executeQuery("SELECT id FROM users WHERE email = ?", [email]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: "Error: Email already exists in Database" });
    }
    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();
    await executeQuery(
      "INSERT INTO users (id, email, password, role_id, role, status, firstName, lastName) VALUES (?, ?, ?, ?, 'admin', 'active', ?, ?)",
      [userId, email, hashedPassword, role_id || 2, firstName, lastName]
    );
    res.status(201).json({ success: true, message: "New Admin Created Successfully!" });
  } catch (error) {
    console.error("Add Admin Error:", error);
    res.status(500).json({ success: false, message: "Database Error" });
  }
};


export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();

    await executeQuery(
      
      "INSERT INTO users (id, firstName, lastName, email, password, role, status) VALUES (?, ?, ?, ?, ?, 3, 'active')",
      [userId, firstName, lastName, email, hashedPassword]
    );

    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

export const logoutUser = async (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};

export const refreshAccessToken = async (req, res) => {
  res.json({ success: true, message: "Token refreshed" });
};