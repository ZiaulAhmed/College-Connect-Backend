// middleware/roleMiddleware.js

// Usage: checkRole(["admin"]) or checkRole(["faculty", "admin"])
function checkRole(roles = []) {
  // return an Express middleware function
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // if the user's role is not in the allowed list
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      console.error("Role middleware error:", err);
      return res.status(500).json({ message: "Role check failed" });
    }
  };
}

module.exports = checkRole;
