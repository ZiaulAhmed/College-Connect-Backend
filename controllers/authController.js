// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= JWT Helper =================
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ================= REGISTER =================
// @route   POST /api/auth/register
// @access  Public (ONLY Student & Faculty)
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,

      // student
      dob,
      contact,
      admissionToken,

      // faculty
      facultyId,
      aadharId,
      panId,
      addressProof,
      bankDetails,
      department,
    } = req.body;

    // ---------------- BASIC VALIDATION ----------------
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // ---------------- BLOCK ADMIN REGISTRATION ----------------
    if (role === "admin") {
      return res
        .status(403)
        .json({ message: "Admin registration is not allowed" });
    }

    // ---------------- CHECK EXISTING USER ----------------
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // ---------------- ROLE VALIDATION ----------------
    if (!["student", "faculty"].includes(role)) {
      return res.status(403).json({ message: "Invalid registration role" });
    }

    // ---------------- STUDENT VALIDATION ----------------
    if (role === "student") {
      if (!admissionToken || !dob || !contact) {
        return res.status(400).json({
          message: "Student registration requires all mandatory fields",
        });
      }
    }

    // ---------------- FACULTY VALIDATION ----------------
    if (role === "faculty") {
      if (
        !facultyId ||
        !aadharId ||
        !panId ||
        !addressProof ||
        !bankDetails?.accountNumber ||
        !bankDetails?.ifscCode ||
        !bankDetails?.bankName ||
        !department
      ) {
        return res.status(400).json({
          message: "Faculty registration requires all documents and details",
        });
      }
    }

    // ---------------- PASSWORD HASH ----------------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ---------------- CREATE USER ----------------
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,

      // student
      dob,
      contact,
      admissionToken,

      // faculty
      facultyId,
      aadharId,
      panId,
      addressProof,
      bankDetails,
      department,

      approvalStatus: "PENDING",
      isActive: false,
    });

    return res.status(201).json({
      message: "Registration successful. Await admin approval.",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ================= LOGIN =================
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ---------------- VALIDATION ----------------
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ---------------- PASSWORD CHECK ----------------
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔥 IMPORTANT FIX
    // Approval required ONLY for student & faculty
    if (
      user.role !== "admin" &&
      user.approvalStatus !== "APPROVED"
    ) {
      return res.status(403).json({
        message: "Account pending admin approval",
      });
    }

    // ---------------- TOKEN ----------------
    const token = generateToken(user._id, user.role);

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
