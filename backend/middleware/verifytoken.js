import jwt from "jsonwebtoken";
import User from "../models/users.model.js"; 
import redisClient from "../config/redis.js"; 

export const tokenverification = async (req, res, next) => {

  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated. No token provided." });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId; 
    const userCacheKey = `user:${userId}`;
    
    const cachedUser = await redisClient.get(userCacheKey);

    if (cachedUser) {

      req.user = JSON.parse(cachedUser);
    } else {
      
      const user = await User.findById(userId).select("-password"); 
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }

      req.user = user;

      await redisClient.set(userCacheKey, JSON.stringify(user), "EX", 900);
    }


    next();
  } catch (err) {
    // Handle errors like an expired or invalid token
    return res.status(403).json({ message: "Forbidden: Invalid token." });
  }
};
