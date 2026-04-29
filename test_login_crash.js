const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
require("dotenv").config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");
    
    const email = "admin@example.com";
    const password = "admin123";
    
    const user = await User.findOne({ email });
    if (!user) { console.log("User NOT found"); return; }
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    
    console.log("Generating token with secret:", process.env.JWT_SECRET ? "OK" : "MISSING");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    console.log("Token generated:", !!token);
    
    await mongoose.disconnect();
  } catch (err) {
    console.error("CRASH POINT REACHED:");
    console.error(err);
    process.exit(1);
  }
}

testLogin();
