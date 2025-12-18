import { executeQuery } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

export const createProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profileData = req.body;

    // Check if profile exists
    const existingProfile = await executeQuery(
      "SELECT id FROM profiles WHERE userId = ?",
      [userId]
    );

    if (existingProfile.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Profile already exists" });
    }

    const profileId = uuidv4();
    const columns = ["id", "userId", ...Object.keys(profileData)];
    const values = [profileId, userId, ...Object.values(profileData)];
    const placeholders = columns.map(() => "?").join(",");

    await executeQuery(
      `INSERT INTO profiles (${columns.join(",")}) VALUES (${placeholders})`,
      values
    );

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: { profileId },
    });
  } catch (error) {
    console.error("Create profile error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create profile",
        error: error.message,
      });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;

    // Build update query
    const updateFields = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(",");
    const updateValues = [...Object.values(updateData), userId];

    await executeQuery(
      `UPDATE profiles SET ${updateFields}, updatedAt = NOW() WHERE userId = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update profile",
        error: error.message,
      });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profiles = await executeQuery(
      "SELECT * FROM profiles WHERE userId = ?",
      [userId]
    );

    if (profiles.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.json({
      success: true,
      data: profiles[0],
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch profile",
        error: error.message,
      });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;

    const profiles = await executeQuery(
      `SELECT p.*, u.firstName, u.lastName, u.email 
       FROM profiles p 
       JOIN users u ON p.userId = u.id 
       WHERE p.id = ?`,
      [profileId]
    );

    if (profiles.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.json({
      success: true,
      data: profiles[0],
    });
  } catch (error) {
    console.error("Get profile by ID error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch profile",
        error: error.message,
      });
  }
};

export const searchProfiles = async (req, res) => {
  try {
    const {
      minAge,
      maxAge,
      religion,
      caste,
      location,
      occupation,
      page = 1,
      limit = 20,
    } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT p.id, p.userId, p.age, p.height, p.religion, p.caste, p.location, p.occupation, p.income, 
             p.images, p.isVerified, u.firstName, u.lastName, u.avatar 
      FROM profiles p 
      JOIN users u ON p.userId = u.id 
      WHERE u.status = 'active'
    `;
    const params = [];

    if (minAge) {
      query += " AND p.age >= ?";
      params.push(minAge);
    }
    if (maxAge) {
      query += " AND p.age <= ?";
      params.push(maxAge);
    }
    if (religion) {
      query += " AND p.religion = ?";
      params.push(religion);
    }
    if (caste) {
      query += " AND p.caste = ?";
      params.push(caste);
    }
    if (location) {
      query += " AND p.location LIKE ?";
      params.push(`%${location}%`);
    }
    if (occupation) {
      query += " AND p.occupation LIKE ?";
      params.push(`%${occupation}%`);
    }

    // Get total count
    const countQuery = query.replace(
      /SELECT.*?FROM/,
      "SELECT COUNT(*) as count FROM"
    );
    const countResult = await executeQuery(countQuery, params);
    const total = countResult[0].count;

    // Get paginated results
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const profiles = await executeQuery(query, params);

    res.json({
      success: true,
      data: profiles,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Search profiles error:", error);
    res
      .status(500)
      .json({ success: false, message: "Search failed", error: error.message });
  }
};
