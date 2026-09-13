const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  coverLetter: { type: String, default: "" },
  status: { type: String, enum: ["Applied", "Shortlisted", "Rejected", "Accepted"], default: "Applied" }
}, { timestamps: true });

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: "Remote" },
  type: { type: String, enum: ["Internship", "Job"], required: true },
  skills: [{ type: String }],
  deadline: Date,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applications: [applicationSchema]
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
