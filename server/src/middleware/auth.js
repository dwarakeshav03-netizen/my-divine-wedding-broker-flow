import { verifyAccessToken } from "../utils/tokenManager.js";

export const authenticateToken = (req, res, next) => {
  try {
    
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({ success: false, message: "Access token required" });
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("--- SECURITY CHECK ---");
    
    
    const roleMapping = {
      'super_admin': 1,
      'super admin': 1,
      'admin': 2,
      'user': 3,
      'self': 3
    };

    let userRole = req.user.role;

    
    if (typeof userRole === 'string') {
      const normalizedRole = userRole.toLowerCase();
      if (roleMapping[normalizedRole]) {
        userRole = roleMapping[normalizedRole];
      }
    }

    console.log("Token Role (Original):", req.user.role);
    console.log("Token Role (Mapped):", userRole);
    console.log("Allowed IDs:", allowedRoles);

    
    if (!req.user || !allowedRoles.includes(Number(userRole))) {
      return res.status(403).json({ 
        success: false, 
        message: "Insufficient permissions: Your role ID must be in " + allowedRoles 
      });
    }
    
    next();
  };
};

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
};