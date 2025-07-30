import jwt from "jsonwebtoken";
import User from "../models/users.model.js"; 

export const tokenverification = async (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded || !decoded.userId) {
      return res.status(403).json({ message: "Invalid token payload." });
    }

    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(403).json({ message: "Forbidden: Invalid token." });
  }
};
