const mongoose = require("mongoose");

const SyllabusItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    credits: { type: Number, required: true },
    sem: { type: String, required: true },
    faculty: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SyllabusItem", SyllabusItemSchema);
