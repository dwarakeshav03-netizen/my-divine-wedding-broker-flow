import { executeQuery } from "../config/database.js";
import {
  hashPassword,
  comparePassword,
  generateOTP,
} from "../utils/passwordUtils.js";
import { generateTokens, verifyRefreshToken } from "../utils/tokenManager.js";
import {
  validateEmail,
  validatePassword as validatePwd,
  validateMobile,
} from "../utils/validators.js";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      role = "self",
      gender,
    } = req.body;

    // Validation
    if (!email || !validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid email required" });
    }

    if (!password || !validatePwd(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, uppercase, lowercase, number, and special character",
      });
    }

    // Check if user exists
    const existingUser = await executeQuery(
      "SELECT id FROM users WHERE email = ? OR (mobileNumber = ? AND mobileNumber IS NOT NULL)",
      [email, mobileNumber]
    );

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();

    // Create user
    await executeQuery(
      `INSERT INTO users (id, firstName, lastName, email, mobileNumber, password, role, gender, status, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        userId,
        firstName,
        lastName,
        email,
        mobileNumber,
        hashedPassword,
        role,
        gender,
      ]
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(userId, role);

    // Store refresh token
    await executeQuery(
      "INSERT INTO refresh_tokens (id, userId, token, expiresAt) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))",
      [uuidv4(), userId, refreshToken]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        userId,
        email,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    // Find user
    const users = await executeQuery(
      "SELECT id, firstName, lastName, email, password, role, status FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = users[0];

    // Check status
    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ success: false, message: "User account is blocked" });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // Store refresh token
    await executeQuery(
      "INSERT INTO refresh_tokens (id, userId, token, expiresAt) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))",
      [uuidv4(), user.id, refreshToken]
    );

    res.json({
      success: true,
      message: "Login successful",
      data: {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if token exists in DB
    const tokens = await executeQuery(
      "SELECT id FROM refresh_tokens WHERE userId = ? AND token = ? AND expiresAt > NOW()",
      [decoded.userId, refreshToken]
    );

    if (tokens.length === 0) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    // Generate new access token
    const { accessToken: newAccessToken } = generateTokens(
      decoded.userId,
      decoded.role
    );

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res
      .status(403)
      .json({
        success: false,
        message: "Invalid refresh token",
        error: error.message,
      });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await executeQuery("DELETE FROM refresh_tokens WHERE token = ?", [
        refreshToken,
      ]);
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(500)
      .json({ success: false, message: "Logout failed", error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const users = await executeQuery(
      `SELECT id, firstName, lastName, email, mobileNumber, role, gender, status, avatar, joinedDate 
       FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch user",
        error: error.message,
      });
  }
};
