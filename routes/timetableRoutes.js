const express = require("express");
const router = express.Router();
const { getTimetable, updateTimetable } = require("../controllers/timetableController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// Anyone logged in can get the timetable
router.get("/", protect, getTimetable);

// Only faculty or admin can update the timetable
router.put("/", protect, allowRoles(["faculty", "admin"]), updateTimetable);

module.exports = router;
