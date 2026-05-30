const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

async function resetTeacher() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = "teacher@test.com";
    const password = "test1234";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await User.findOneAndUpdate(
      { email },
      { 
        password: hashedPassword, 
        role: "faculty", 
        approvalStatus: "APPROVED",
        isActive: true
      },
      { upsert: true }
    );
    console.log("Teacher password reset to test1234 successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

resetTeacher();
