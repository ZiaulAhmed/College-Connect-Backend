const Timetable = require("../models/Timetable");

const defaultTimetable = [
  { day: "Monday", slots: ["Math", "Physics", "Chemistry", "English", "Lab"] },
  { day: "Tuesday", slots: ["Physics", "Math", "Biology", "Computing", "Library"] },
  { day: "Wednesday", slots: ["Chemistry", "Physics", "Math", "English", "Seminar"] },
  { day: "Thursday", slots: ["Biology", "Chemistry", "Computing", "Math", "Sports"] },
  { day: "Friday", slots: ["Computing", "Math", "Physics", "Project", "Mentoring"] },
];

exports.getTimetable = async (req, res) => {
  try {
    const department = req.query.department || "Computer Science";
    let timetable = await Timetable.findOne({ department });
    
    if (!timetable) {
      timetable = await Timetable.create({ department, days: defaultTimetable });
    }
    res.status(200).json(timetable);
  } catch (error) {
    console.error("Fetch timetable error:", error);
    res.status(500).json({ message: "Failed to fetch timetable" });
  }
};

exports.updateTimetable = async (req, res) => {
  try {
    const { days, department } = req.body;
    const dep = department || "Computer Science";
    let timetable = await Timetable.findOne({ department: dep });
    
    if (!timetable) {
      timetable = new Timetable({ department: dep, days });
    } else {
      timetable.days = days;
    }
    
    await timetable.save();
    res.status(200).json({ message: "Timetable updated successfully", timetable });
  } catch (error) {
    console.error("Update timetable error:", error);
    res.status(500).json({ message: "Failed to update timetable" });
  }
};
