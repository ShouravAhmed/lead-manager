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
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: "Access denied" });
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }
      next();
    };
  };

  export const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Access denied" });
    }
    if (req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: "Access denied. Admin access required." });
    }
    next();
  };

  export const isSuperAdmin = (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Access denied" });
    }
    if (req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: "Access denied. Super admin access required." });
    }
    next();
  };
  