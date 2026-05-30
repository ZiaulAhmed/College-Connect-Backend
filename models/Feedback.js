const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  course: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
