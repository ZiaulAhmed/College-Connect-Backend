// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - require valid token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbacksecret");

      // Support for mock users from authController bypass
      if (decoded.id && decoded.id.toString().startsWith("mock_")) {
        req.user = {
          _id: "000000000000000000000001", // Valid 24-char hex ObjectId for Mongoose
          role: decoded.role,
          department: "Physics" // Default for testing
        };
        return next();
      }

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      return next();
    } catch (error) {
      console.error("JWT error:", error);
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Restrict access to certain roles
const allowRoles = (...roles) => {
  const allowedRoles = roles.flat();
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};

module.exports = { protect, allowRoles };
