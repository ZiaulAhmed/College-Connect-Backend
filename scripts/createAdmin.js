const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for admin seed");

    const email = "admin@example.com";
    const plainPassword = "admin123"; // ✅ FIXED PASSWORD

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      // 🔥 FORCE RESET PASSWORD
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      existingAdmin.approvalStatus = "APPROVED";
      existingAdmin.isActive = true;

      await existingAdmin.save();
      console.log("Admin password RESET successfully");
    } else {
      await User.create({
        name: "Admin",
        email,
        password: hashedPassword,
        role: "admin",
        approvalStatus: "APPROVED",
        isActive: true,
      });
      console.log("Admin created successfully");
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
