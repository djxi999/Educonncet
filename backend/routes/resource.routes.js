const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Resource = require("../models/Resource");
const { auth } = require("../middleware/auth");

const uploadDir = path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`)
});
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

router.get("/", auth, async (req, res) => {
  const { q, subject, university, category, page = 1 } = req.query;
  const filter = {};
  if (subject) filter.subject = new RegExp(subject, "i");
  if (university) filter.university = new RegExp(university, "i");
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };
  const limit = 12;
  const resources = await Resource.find(filter).populate("uploadedBy", "name university role")
    .sort("-createdAt").skip((page - 1) * limit).limit(limit);
  const total = await Resource.countDocuments(filter);
  res.json({ resources, total, page: Number(page), pages: Math.ceil(total / limit) });
});

router.post("/", auth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please select a file" });
  const resource = await Resource.create({
    title: req.body.title,
    description: req.body.description,
    subject: req.body.subject,
    university: req.body.university,
    category: req.body.category || "Notes",
    fileName: req.file.originalname,
    fileUrl: `/uploads/${req.file.filename}`,
    uploadedBy: req.user._id
  });
  res.status(201).json(resource);
});

module.exports = router;
