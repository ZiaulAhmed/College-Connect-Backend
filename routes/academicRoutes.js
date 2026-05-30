const express = require("express");
const router = express.Router();
const {
  getNotes, addNote, deleteNote,
  getSyllabus, addSyllabus, deleteSyllabus,
  getStudentsByDepartment
} = require("../controllers/academicController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// Notes Routes
router.get("/notes", protect, getNotes);
router.post("/notes", protect, allowRoles(["faculty", "admin"]), addNote);
router.delete("/notes/:id", protect, allowRoles(["faculty", "admin"]), deleteNote);

// Syllabus Routes
router.get("/syllabus", protect, getSyllabus);
router.post("/syllabus", protect, allowRoles(["faculty", "admin"]), addSyllabus);
router.delete("/syllabus/:id", protect, allowRoles(["faculty", "admin"]), deleteSyllabus);

// Students Route
router.get("/students", protect, allowRoles(["faculty", "admin"]), getStudentsByDepartment);

module.exports = router;
