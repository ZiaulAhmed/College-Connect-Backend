const Note = require("../models/Note");
const SyllabusItem = require("../models/SyllabusItem");

// --- NOTES ---
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
};

exports.addNote = async (req, res) => {
  try {
    const newNote = await Note.create(req.body);
    res.status(201).json({ message: "Note added successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Error adding note", error });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
};

// --- SYLLABUS ---
exports.getSyllabus = async (req, res) => {
  try {
    const syllabus = await SyllabusItem.find().sort({ createdAt: -1 });
    res.status(200).json(syllabus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching syllabus", error });
  }
};

exports.addSyllabus = async (req, res) => {
  try {
    const newItem = await SyllabusItem.create(req.body);
    res.status(201).json({ message: "Syllabus added successfully", syllabus: newItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding syllabus", error });
  }
};

exports.deleteSyllabus = async (req, res) => {
  try {
    await SyllabusItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Syllabus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting syllabus", error });
  }
};

// --- STUDENTS IN DEPARTMENT ---
const User = require("../models/User");
exports.getStudentsByDepartment = async (req, res) => {
  try {
    const department = req.user.department;
    if (!department) {
      return res.status(400).json({ message: "Department not found for the user" });
    }
    const students = await User.find({ role: "student", department }).select("-password");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};
