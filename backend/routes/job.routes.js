const router = require("express").Router();
const Job = require("../models/Job");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const { q, type, location } = req.query;
  const filter = {};
  if (q) filter.$or = [{ title: new RegExp(q, "i") }, { company: new RegExp(q, "i") }, { description: new RegExp(q, "i") }];
  if (type) filter.type = type;
  if (location) filter.location = new RegExp(location, "i");
  const jobs = await Job.find(filter).populate("postedBy", "name role university").sort("-createdAt");
  res.json(jobs);
});

router.post("/", auth, requireRole("Professional"), async (req, res) => {
  const job = await Job.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json(await job.populate("postedBy", "name role"));
});

router.post("/:id/apply", auth, requireRole("Student"), async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Opportunity not found" });
  if (job.applications.some(a => a.student.toString() === req.user._id.toString())) return res.status(409).json({ message: "Already applied" });
  job.applications.push({ student: req.user._id, coverLetter: req.body.coverLetter || "" });
  await job.save();
  res.json({ message: "Application submitted" });
});

router.get("/mine", auth, requireRole("Professional"), async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).populate("applications.student", "name email university");
  res.json(jobs);
});

router.patch("/:jobId/applications/:applicationId", auth, requireRole("Professional"), async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
  if (!job) return res.status(404).json({ message: "Opportunity not found" });
  const app = job.applications.id(req.params.applicationId);
  if (!app) return res.status(404).json({ message: "Application not found" });
  app.status = req.body.status;
  await job.save();
  res.json(app);
});

module.exports = router;
