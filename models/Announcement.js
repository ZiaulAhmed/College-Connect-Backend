// models/Announcement.js
const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: String, default: null }, // null = college-wide
    isGlobal: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    approved: { type: Boolean, default: false }, // admin can approve
    attachments: [
      {
        filename: String,
        url: String,
      },
    ],
    meta: {
      views: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
