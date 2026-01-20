import { executeQuery } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

/* =======================
   GET PROFILE BY ID
======================= */
export const getProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;

    const profiles = await executeQuery(
      "SELECT * FROM profiles WHERE id = ?",
      [profileId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      data: profiles[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/* =======================
   CREATE PROFILE
======================= */
export const createProfile = [
  async (req, res) => {
    try {
      console.log("REQ.FILE 👉", req.files);
      console.log("REQ.BODY 👉", req.body);
      console.log("REQ.USER 👉", req.user);

      const userId = req.user.id;

      const licenseFile = req.files?.licenseFile?.[0]?.filename || null;


     const profileData = {
  profile_for: req.body.profile_for,
  name: req.body.name,
  gender: req.body.gender,
  dob: req.body.dob,
  age: req.body.age,
  religion: req.body.religion,
  caste: req.body.caste,
  location: req.body.location,
  marital_status: req.body.marital_status,
  education: req.body.education,
  profession: req.body.profession,
  income: req.body.income,
  height: req.body.height,
  weight: req.body.weight,
  licenseFile: licenseFile,
};

      

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
      res.status(500).json({
        success: false,
        message: "Failed to create profile",
        error: error.message,
      });
    }
  },
];

/* =======================
   UPDATE PROFILE
======================= */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const fields = Object.keys(updateData)
      .map(key => `${key} = ?`)
      .join(", ");

    const values = [...Object.values(updateData), userId];

    await executeQuery(
      `UPDATE profiles SET ${fields}, updatedAt = NOW() WHERE userId = ?`,
      values
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

/* =======================
   GET PROFILE (LOGGED USER)
======================= */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await executeQuery(
      "SELECT * FROM profiles WHERE userId = ?",
      [userId]
    );
    res.json({ success: true, data: profile[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =======================
   SEARCH PROFILES
======================= */
export const searchProfiles = async (req, res) => {
  try {
    const { religion, caste, location, minAge, maxAge } = req.query;
    let query = "SELECT * FROM profiles WHERE isVerified = 1";
    const params = [];

    if (religion) { query += " AND religion = ?"; params.push(religion); }
    if (caste) { query += " AND caste = ?"; params.push(caste); }
    if (location) { query += " AND location LIKE ?"; params.push(`%${location}%`); }
    if (minAge) { query += " AND age >= ?"; params.push(minAge); }
    if (maxAge) { query += " AND age <= ?"; params.push(maxAge); }

    const results = await executeQuery(query, params);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Search failed" });
  }
};

/* =======================
   ADMIN – PENDING PROFILES
======================= */
export const getPendingProfiles = async (req, res) => {
  try {
    const query = `
      SELECT p.*, u.firstName, u.lastName, u.avatar
      FROM profiles p
      JOIN users u ON p.userId = u.id
      WHERE p.isVerified = 0 OR p.isVerified IS NULL
      ORDER BY p.createdAt DESC
    `;
    const pendingProfiles = await executeQuery(query);
    res.json({ success: true, data: pendingProfiles });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =======================
   VERIFY PROFILE
======================= */
export const verifyProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    await executeQuery(
      "UPDATE profiles SET isVerified = 1, updatedAt = NOW() WHERE id = ?",
      [profileId]
    );
    res.json({ success: true, message: "Profile verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to verify profile" });
  }
};

/* =======================
   ADMIN STATS
======================= */
export const getAdminStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT
        (SELECT COUNT(*) FROM users) as totalUsers,
        (SELECT COUNT(*) FROM profiles WHERE isVerified = 0 OR isVerified IS NULL) as pendingProfiles,
        (SELECT COUNT(*) FROM connections WHERE status = 'accepted') as totalMatches
    `;
    const stats = await executeQuery(statsQuery);
    res.json({ success: true, data: stats[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Stats failed" });
  }
};
