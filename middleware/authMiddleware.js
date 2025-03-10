import jwt from "jsonwebtoken";

  export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) return res.status(403).json({ message: "Token required" });
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
    } 
    catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };

  export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    };
  };
  