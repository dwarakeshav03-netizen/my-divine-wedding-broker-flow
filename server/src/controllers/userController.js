import { executeQuery } from "../config/database.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await executeQuery(
      "SELECT id, firstName, lastName, email, mobileNumber, status, role_id, avatar, gender FROM users WHERE role_id = 3", 
      []
    );
    
    const formattedUsers = users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName || ''}`.trim(),
        email: user.email,
        mobile: user.mobileNumber || 'No Phone', 
        status: user.status,
        role: 'User',
        plan: 'free', 
        gender: user.gender,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}&background=random`
    }));

    res.json({ success: true, data: formattedUsers });
  } catch (error) {
    console.error("DB Fetch Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};