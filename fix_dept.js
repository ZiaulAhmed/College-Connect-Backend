const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/collegeconnect').then(async () => {
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const result = await User.updateMany({ role: 'student', $or: [{ department: { $exists: false } }, { department: null }] }, { $set: { department: 'Computer Science' } });
  console.log(result);
  process.exit(0);
});
