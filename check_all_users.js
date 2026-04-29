const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({}, "email role approvalStatus");
  const fs = require("fs");
  fs.writeFileSync("users_list.json", JSON.stringify(users, null, 2));
  await mongoose.disconnect();
}

check();
