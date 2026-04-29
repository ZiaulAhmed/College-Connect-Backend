// controllers/announcementController.js
const Announcement = require("../models/Announcement");
const User = require("../models/User");

// Create announcement (faculty or admin)
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, department, isGlobal, pinned, attachments } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const announcement = await Announcement.create({
      title,
      content,
      author: req.user._id,
      department: department || null,
      isGlobal: !!isGlobal,
      pinned: !!pinned,
      attachments: attachments || [],
      approved: req.user.role === "admin" ? true : false, // auto-approve if admin
    });

    res.status(201).json({ message: "Announcement created", announcement });
  } catch (error) {
    console.error("createAnnouncement error:", error);
    res.status(500).json({ message: "Server error creating announcement" });
  }
};

// Get announcements (public) with query filters
const getAnnouncements = async (req, res) => {
  try {
    const { department, global, approved, page = 1, limit = 20, q } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (global === "true") filter.isGlobal = true;
    if (approved === "true") filter.approved = true;
    if (q) filter.$or = [
      { title: new RegExp(q, "i") },
      { content: new RegExp(q, "i") }
    ];

    // Only return approved announcements for public requests unless user is admin/faculty
    if (!req.user || req.user.role === "student") {
      filter.approved = true;
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit));
    const announcements = await Announcement.find(filter)
      .sort({ pinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(Math.max(1, parseInt(limit)))
      .populate("author", "name email role department");

    res.json({ count: announcements.length, announcements });
  } catch (error) {
    console.error("getAnnouncements error:", error);
    res.status(500).json({ message: "Server error fetching announcements" });
  }
};

// Get single announcement and increment view count
const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { $inc: { "meta.views": 1 } },
      { new: true }
    ).populate("author", "name email role department");

    if (!announcement) return res.status(404).json({ message: "Announcement not found" });

    res.json({ announcement });
  } catch (error) {
    console.error("getAnnouncementById error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin approves/unapproves announcement
const setApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;
    const ann = await Announcement.findByIdAndUpdate(id, { approved: !!approved }, { new: true });
    if (!ann) return res.status(404).json({ message: "Announcement not found" });
    res.json({ message: `Announcement ${approved ? "approved" : "unapproved"}`, announcement: ann });
  } catch (error) {
    console.error("setApproval error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update announcement (author or admin)
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const ann = await Announcement.findById(id);
    if (!ann) return res.status(404).json({ message: "Announcement not found" });

    // only admin or the original author can update
    if (req.user.role !== "admin" && ann.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this announcement" });
    }

    const updates = req.body;
    Object.assign(ann, updates);
    await ann.save();

    res.json({ message: "Announcement updated", announcement: ann });
  } catch (error) {
    console.error("updateAnnouncement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete announcement (author or admin) — SAFE: permission check first, then delete by id
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    // Load the announcement to check existence and permissions
    const ann = await Announcement.findById(id);
    if (!ann) return res.status(404).json({ message: "Announcement not found" });

    // only admin or the original author can delete
    if (req.user.role !== "admin" && ann.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this announcement" });
    }

    // Delete by id (safe, avoids calling document.remove which may not exist)
    const deleted = await Announcement.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Announcement deleted successfully",
      deleted
    });
  } catch (error) {
    console.error("deleteAnnouncement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  setApproval,
  updateAnnouncement,
  deleteAnnouncement,
};
