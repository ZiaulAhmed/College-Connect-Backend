const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/feedback
// @desc    Submit feedback (students only)
router.post("/", protect, async (req, res) => {
  try {
    const { course, rating, comment } = req.body;
    
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit feedback" });
    }

    const newFeedback = new Feedback({
      course,
      rating,
      comment,
      student: req.user._id,
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// @route   GET /api/feedback
// @desc    Get all feedback (faculty and admin only)
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role === "student") {
      return res.status(403).json({ message: "Students cannot view all feedback" });
    }

    const feedbacks = await Feedback.find().populate("student", "name email").sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
