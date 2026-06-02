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

const mockUsers = []; // 🔥 Store registered users in memory for mock testing

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
      return res.status(403).json({ message: "Admin registration is not allowed" });
    }

    // ---------------- ROLE VALIDATION ----------------
    if (!["student", "faculty"].includes(role)) {
      return res.status(403).json({ message: "Invalid registration role" });
    }

    // ---------------- STUDENT VALIDATION ----------------
    if (role === "student") {
      if (!admissionToken || !dob || !contact) {
        return res.status(400).json({ message: "Student registration requires all mandatory fields" });
      }
    }

    // ---------------- FACULTY VALIDATION ----------------
    if (role === "faculty") {
      if (!facultyId || !aadharId || !panId || !addressProof || !bankDetails?.accountNumber || !bankDetails?.ifscCode || !bankDetails?.bankName || !department) {
        return res.status(400).json({ message: "Faculty registration requires all documents and details" });
      }
    }

    // 🔥 MOCK BYPASS FOR REGISTRATION (Saves to memory array instead of DB)
    const existingMock = mockUsers.find(u => u.email === email.trim().toLowerCase());
    if (existingMock) {
      return res.status(409).json({ message: "User already exists (Mock)" });
    }

    const mockUser = {
      _id: "mock_" + Date.now(),
      name, 
      email: email.trim().toLowerCase(), 
      role,
      dob, contact, admissionToken,
      facultyId, department,
      approvalStatus: "APPROVED", // Auto-approved so you can login instantly
      isActive: true
    };
    mockUsers.push(mockUser);

    return res.status(201).json({
      message: "Registration successful (Mock Mode). Auto-approved for testing.",
      user: mockUser,
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
    const trimmedEmail = email?.trim()?.toLowerCase();

    // ---------------- VALIDATION ----------------
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 🔥 MOCK BYPASS FOR ADMIN LOGIN
    if (trimmedEmail === "admin@example.com" && password === "admin123") {
      const mockToken = jwt.sign({ id: "mock_admin_id", role: "admin" }, process.env.JWT_SECRET || "fallbacksecret", { expiresIn: "7d" });
      return res.json({ message: "Login successful (Mock Mode)", token: mockToken, user: { _id: "mock_admin_id", name: "Admin", email: "admin@example.com", role: "admin", approvalStatus: "APPROVED" }});
    }

    // 🔥 MOCK BYPASS FOR HARDCODED TEACHER
    if (trimmedEmail === "teacher@test.com") {
      const mockToken = jwt.sign({ id: "mock_teacher_id", role: "faculty" }, process.env.JWT_SECRET || "fallbacksecret", { expiresIn: "7d" });
      return res.json({ message: "Login successful (Mock Mode)", token: mockToken, user: { _id: "mock_teacher_id", name: "Test Teacher", email: "teacher@test.com", role: "faculty", approvalStatus: "APPROVED", facultyId: "T002", department: "Physics" }});
    }

    // 🔥 MOCK BYPASS FOR HARDCODED STUDENT
    const mockStudentEmails = [
      "ziaul32@gmail.com",
      "abcd2@gmail.com",
      "abdul43@gmail.com",
      "asadul23@gmail.com",
      "deepak43@gmail.com",
      "jain43@gmail.com",
      "moki43@gmail.com",
      "rakibul23@gmail.com"
    ];
    if (mockStudentEmails.includes(trimmedEmail)) {
      const mockToken = jwt.sign({ id: "mock_student_id", role: "student" }, process.env.JWT_SECRET || "fallbacksecret", { expiresIn: "7d" });
      return res.json({ message: "Login successful (Mock Mode)", token: mockToken, user: { _id: "mock_student_id", name: "Student", email: trimmedEmail, role: "student", approvalStatus: "APPROVED" }});
    }

    // 🔥 MOCK BYPASS FOR NEW SIGNUPS
    const foundMockUser = mockUsers.find(u => u.email === trimmedEmail);
    if (foundMockUser) {
      const mockToken = jwt.sign({ id: foundMockUser._id, role: foundMockUser.role }, process.env.JWT_SECRET || "fallbacksecret", { expiresIn: "7d" });
      return res.json({ message: "Login successful (Mock Signup Mode)", token: mockToken, user: foundMockUser });
    }

    // ⏳ If it reaches here, it will try the real database (which will currently timeout and return 500)
    const user = await User.findOne({ email: trimmedEmail });
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
