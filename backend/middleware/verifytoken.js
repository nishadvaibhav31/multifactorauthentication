import jwt from "jsonwebtoken";

export const tokenverification = (req, res, next) => {
  // console.log("hello");

  const token = req.cookies.auth_token;
  if (!token) return res.status(400).json({ message: "not authenticated" });
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "forbidden" });
    req.user = user;
    
    next();
  });
};
