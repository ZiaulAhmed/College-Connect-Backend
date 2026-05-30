// server.js
require('dns').setDefaultResultOrder('ipv4first');

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// 🔹 STEP 3.1 (UPDATE): Import User model for debug route
const User = require("./models/User");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ====== Middlewares ======
app.use(cors());
app.use(express.json()); // Parse JSON request body
app.use(morgan("dev"));

// ====== Routes ======
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));
app.use("/api/academic", require("./routes/academicRoutes")); // ✅ ADD ACADEMIC ROUTES
app.use("/api/feedback", require("./routes/feedbackRoutes")); // Add Feedback Routes

// 🔹 STEP 3: Admin routes (Approve / Reject students & faculty)
app.use("/api/admin", require("./routes/adminRoutes"));

/* =========================================================
   🔹 STEP 3.1 (NEW TEMPORARY DEBUG ROUTE)
   Purpose:
   - Force MongoDB Atlas to create database
   - Force creation of `users` collection
   - Insert a test admin user
   ========================================================= */
app.get("/api/debug/create-user", async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("test1234", salt);

    const user = await User.create({
      name: "Test Teacher",
      email: "teacher@test.com",
      password: hashedPassword, // ✅ HASHED PASSWORD
      role: "faculty",
      approvalStatus: "APPROVED",
      isActive: true,
      facultyId: "T002",
      aadharId: "123456789012",
      panId: "ABCDE1234G",
      addressProof: "some_uri",
      bankDetails: {
        accountNumber: "9876543210",
        ifscCode: "IFSC002",
        bankName: "Test Bank",
      },
      department: "Physics",
    });

    res.json({
      message: "Test user created successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Debug user creation error:", error);
    res.status(500).json({
      message: "Failed to create debug user",
      error: error.message,
    });
  }
});
// ====== END OF STEP 3.1 UPDATE ======

// ====== Test Route ======
app.get("/", (req, res) => {
  res.send("College Connect API is running");
});

// ====== Basic Error Handler ======
app.use((err, req, res, next) => {
  console.error(err); // log full error on server
  res.status(err.status || 500).json({
    message: err.message || "Server error",
    // stack: err.stack // enable only in development if needed
  });
});

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ====== Graceful shutdown ======
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});
