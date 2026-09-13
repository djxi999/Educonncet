const router = require("express").Router();
const Connection = require("../models/Connection");
const { auth } = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const rows = await Connection.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }]
  }).populate("sender", "name role university").populate("receiver", "name role university");
  res.json(rows);
});

router.post("/:userId", auth, async (req, res) => {
  if (req.params.userId === req.user._id.toString()) return res.status(400).json({ message: "Cannot connect to yourself" });
  const existing = await Connection.findOne({
    $or: [{ sender: req.user._id, receiver: req.params.userId }, { sender: req.params.userId, receiver: req.user._id }]
  });
  if (existing) return res.status(409).json({ message: "Connection request already exists" });
  const row = await Connection.create({ sender: req.user._id, receiver: req.params.userId });
  res.status(201).json(row);
});

router.patch("/:id", auth, async (req, res) => {
  const row = await Connection.findOne({ _id: req.params.id, receiver: req.user._id });
  if (!row) return res.status(404).json({ message: "Request not found" });
  if (!["accepted", "rejected"].includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
  row.status = req.body.status;
  await row.save();
  res.json(row);
});

module.exports = router;
