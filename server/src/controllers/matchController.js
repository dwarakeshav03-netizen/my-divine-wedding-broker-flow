import { executeQuery } from "../config/database.js";

export const getTodayMatches = async (req, res) => {
  const query = `
    SELECT 
      u.id, u.firstName, u.lastName, u.avatar, u.gender,
      p.age, p.education, p.caste, p.religion, p.plan,
      MAX(c.createdAt) as latestMatch
    FROM users u
    JOIN profiles p ON u.id = p.userId
    JOIN connections c ON (u.id = c.senderId OR u.id = c.receiverId)
    WHERE c.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY 
      u.id, u.firstName, u.lastName, u.avatar, u.gender, 
      p.age, p.education, p.caste, p.religion, p.plan
    ORDER BY latestMatch DESC
  `;
    
  try {
    const results = await executeQuery(query, []);
    res.json({ 
        success: true, 
        data: results 
    });
  } catch (error) {
    console.error("SQL Error in matchController:", error);
    res.status(500).json({ 
        success: false, 
        message: "Internal Server Error: SQL Grouping failed." 
    });
  }
};