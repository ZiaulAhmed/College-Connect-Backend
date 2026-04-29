const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    const users = await User.find({}, "email role approvalStatus password");
    console.log("USERS_START");
    console.log(JSON.stringify(users, null, 2));
    console.log("USERS_END");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error checking users:", err);
  }
}

checkUsers();
