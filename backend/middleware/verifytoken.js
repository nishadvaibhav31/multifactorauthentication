import jwt from "jsonwebtoken";
import User from "../models/users.model.js"; 
import redisClient from "../config/redis.js"; // Import your configured Redis client

export const tokenverification = async (req, res, next) => {
  // 1. Get the token from the browser's cookies
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated. No token provided." });
  }

  try {
    // 2. Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id; // Assuming your JWT payload has an 'id' field
    const userCacheKey = `user:${userId}`; // Create a unique key for Redis

    // 3. Check Redis Cache First
    const cachedUser = await redisClient.get(userCacheKey);

    if (cachedUser) {
      // CACHE HIT: User was found in Redis
      req.user = JSON.parse(cachedUser);
    } else {
      // CACHE MISS: User not in Redis, so get from MongoDB
      const user = await User.findById(userId).select("-password"); // Exclude password
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }

      req.user = user;

      // Store the fresh user data in Redis for 15 minutes (900 seconds)
      await redisClient.set(userCacheKey, JSON.stringify(user), "EX", 900);
    }

    // 4. User is authenticated, proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle errors like an expired or invalid token
    return res.status(403).json({ message: "Forbidden: Invalid token." });
  }
};