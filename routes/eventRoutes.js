// routes/eventRoutes.js
const express = require("express");
const router = express.Router();

// In-memory sample data for Events & Placements
let sampleEvents = [
  {
    _id: "1",
    title: "Hackathon 2025",
    description: "24-hour coding challenge for CSE students.",
    type: "event",
    date: "2025-12-15T09:00:00.000Z",
    location: "CSE Auditorium",
    department: "CSE",
    isOnline: false,
    link: "https://example.com/hackathon-register",
  },
  {
    _id: "2",
    title: "Infosys Campus Drive",
    description: "Placement drive for final-year students.",
    type: "placement",
    date: "2025-11-30T10:00:00.000Z",
    location: "Main Seminar Hall",
    department: "ALL",
    isOnline: false,
    link: "https://example.com/infosys-drive",
  },
  {
    _id: "3",
    title: "AWS Cloud Workshop",
    description: "Hands-on session on AWS basics.",
    type: "event",
    date: "2025-12-05T14:30:00.000Z",
    location: "Lab 3",
    department: "CSE",
    isOnline: true,
    link: "https://example.com/aws-workshop",
  },
];

// GET /api/events -> return all events
router.get("/", (req, res) => {
  res.json(sampleEvents);
});

// POST /api/events -> create a new event (in-memory)
router.post("/", (req, res) => {
  const {
    title,
    description,
    date,      // "YYYY-MM-DD"
    time,      // "HH:MM"
    type,
    department,
    location,
    isOnline,
    link,
  } = req.body;

  if (!title || !description || !date || !time) {
    return res
      .status(400)
      .json({ message: "Title, description, date and time are required" });
  }

  // Combine date + time into a single ISO string
  const dateTime = new Date(`${date}T${time}`);

  const newEvent = {
    _id: String(sampleEvents.length + 1),
    title,
    description,
    type: type || "event",          // "event" or "placement"
    date: dateTime.toISOString(),
    location: location || "TBD",
    department: department || "ALL",
    isOnline: typeof isOnline === "boolean" ? isOnline : false,
    link: link || "#",
  };

  sampleEvents.push(newEvent);

  return res
    .status(201)
    .json({ message: "Event created successfully", event: newEvent });
});

module.exports = router;
