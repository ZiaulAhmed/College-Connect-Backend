// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["event", "placement"],
      default: "event",
    },
    date: { type: Date, required: true },
    location: { type: String, default: "Campus" },
    department: { type: String, default: "ALL" },
    isOnline: { type: Boolean, default: false },
    link: { type: String },
    approved: { type: Boolean, default: false }, // Admin must approve
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
