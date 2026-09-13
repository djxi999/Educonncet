const router = require("express").Router();
const Message = require("../models/Message");
const { auth } = require("../middleware/auth");

router.get("/:userId", auth, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id }
    ]
  }).sort("createdAt").populate("sender", "name").populate("receiver", "name");
  res.json(messages);
});

router.post("/", auth, async (req, res) => {
  const { receiver, text } = req.body;
  if (!receiver || !text?.trim()) return res.status(400).json({ message: "Receiver and text are required" });
  const message = await Message.create({ sender: req.user._id, receiver, text });
  await message.populate("sender", "name");
  await message.populate("receiver", "name");

  const io = req.app.get("io");
  io.to(`user:${receiver}`).emit("message:new", message);
  res.status(201).json(message);
});

module.exports = router;
