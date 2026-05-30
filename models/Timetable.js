const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      default: "Computer Science",
    },
    semester: {
      type: String,
      default: "Semester 4",
    },
    days: [
      {
        day: { type: String },
        slots: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", TimetableSchema);
