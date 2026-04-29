// controllers/adminController.js
const User = require("../models/User");

/* =========================================================
   PENDING REGISTRATIONS
========================================================= */

// ---------- Pending Students ----------
exports.getPendingStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      approvalStatus: "PENDING",
    }).select("-password");

    res.status(200).json(students);
  } catch (error) {
    console.error("Fetch pending students error:", error);
    res.status(500).json({ message: "Failed to fetch pending students" });
  }
};

// ---------- Pending Faculty ----------
exports.getPendingFaculty = async (req, res) => {
  try {
    const faculty = await User.find({
      role: "faculty",
      approvalStatus: "PENDING",
    }).select("-password");

    res.status(200).json(faculty);
  } catch (error) {
    console.error("Fetch pending faculty error:", error);
    res.status(500).json({ message: "Failed to fetch pending faculty" });
  }
};

// ---------- All Pending (Student + Faculty) ----------
exports.getPendingRegistrations = async (req, res) => {
  try {
    const users = await User.find({
      approvalStatus: "PENDING",
      role: { $in: ["student", "faculty"] },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch pending registrations error:", error);
    res.status(500).json({ message: "Failed to fetch pending registrations" });
  }
};

/* =========================================================
   APPROVED USERS
========================================================= */

// ---------- Approved Students ----------
exports.getApprovedStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      approvalStatus: "APPROVED",
    }).select("-password");

    res.status(200).json(students);
  } catch (error) {
    console.error("Fetch approved students error:", error);
    res.status(500).json({ message: "Failed to fetch approved students" });
  }
};

// ---------- Approved Faculty ----------
exports.getApprovedFaculty = async (req, res) => {
  try {
    const faculty = await User.find({
      role: "faculty",
      approvalStatus: "APPROVED",
    }).select("-password");

    res.status(200).json(faculty);
  } catch (error) {
    console.error("Fetch approved faculty error:", error);
    res.status(500).json({ message: "Failed to fetch approved faculty" });
  }
};

/* =========================================================
   APPROVE / REJECT WITH COMMENTS
========================================================= */

// ---------- Approve User ----------
exports.approveUser = async (req, res) => {
  try {
    const { comment } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["student", "faculty"].includes(user.role)) {
      return res
        .status(400)
        .json({ message: "Only student or faculty can be approved" });
    }

    user.approvalStatus = "APPROVED";
    user.approvalComment = comment || "Approved by admin";
    user.approvedAt = new Date();
    user.rejectedAt = null;
    user.isActive = true;

    await user.save();

    res.status(200).json({
      message: `${user.role} approved successfully`,
      userId: user._id,
    });
  } catch (error) {
    console.error("Approve user error:", error);
    res.status(500).json({ message: "Failed to approve user" });
  }
};

// ---------- Reject User ----------
exports.rejectUser = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res
        .status(400)
        .json({ message: "Rejection comment is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["student", "faculty"].includes(user.role)) {
      return res
        .status(400)
        .json({ message: "Only student or faculty can be rejected" });
    }

    user.approvalStatus = "REJECTED";
    user.approvalComment = comment;
    user.rejectedAt = new Date();
    user.approvedAt = null;
    user.isActive = false;

    await user.save();

    res.status(200).json({
      message: `${user.role} rejected successfully`,
      userId: user._id,
    });
  } catch (error) {
    console.error("Reject user error:", error);
    res.status(500).json({ message: "Failed to reject user" });
  }
};
