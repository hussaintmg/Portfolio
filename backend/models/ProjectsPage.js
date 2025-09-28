const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
