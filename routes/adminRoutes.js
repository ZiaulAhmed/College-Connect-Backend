// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

// ================= CONTROLLERS =================
const {
  getPendingRegistrations,
  getPendingStudents,
  getPendingFaculty,      // ✅ ADD
  getApprovedStudents,    // (for later use)
  getApprovedFaculty,     // (for later use)
  approveUser,
  rejectUser,
} = require("../controllers/adminController");

// ================= MIDDLEWARE =================
const { protect } = require("../middleware/authMiddleware");

// ================= ADMIN-ONLY GUARD =================
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

// ================= ROUTES =================

// 🔹 All pending (students + faculty)
router.get(
  "/pending-registrations",
  protect,
  adminOnly,
  getPendingRegistrations
);

// 🔹 Pending students only
router.get(
  "/pending-students",
  protect,
  adminOnly,
  getPendingStudents
);

// 🔹 ✅ Pending faculty only (NEW – REQUIRED)
router.get(
  "/pending-faculty",
  protect,
  adminOnly,
  getPendingFaculty
);

// 🔹 Approved students (for list page)
router.get(
  "/approved-students",
  protect,
  adminOnly,
  getApprovedStudents
);

// 🔹 Approved faculty (for list page)
router.get(
  "/approved-faculty",
  protect,
  adminOnly,
  getApprovedFaculty
);

// 🔹 Approve user (student / faculty)
router.put(
  "/approve-user/:id",
  protect,
  adminOnly,
  approveUser
);

// 🔹 Reject user (student / faculty)
router.put(
  "/reject-user/:id",
  protect,
  adminOnly,
  rejectUser
);

module.exports = router;
