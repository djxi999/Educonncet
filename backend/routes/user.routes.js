const router = require("express").Router();
const User = require("../models/User");
const { auth } = require("../middleware/auth");

router.get("/me", auth, async (req, res) => res.json(req.user));

router.get("/", auth, async (req, res) => {
  const q = req.query.q || "";
  const users = await User.find({
    _id: { $ne: req.user._id },
    $or: [{ name: new RegExp(q, "i") }, { university: new RegExp(q, "i") }, { role: new RegExp(q, "i") }]
  }).select("-password").limit(30);
  res.json(users);
});

router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.put("/me", auth, async (req, res) => {
  const allowed = ["name", "university", "bio", "skills", "avatar"];
  allowed.forEach(k => { if (req.body[k] !== undefined) req.user[k] = req.body[k]; });
  await req.user.save();
  res.json(req.user);
});

module.exports = router;
