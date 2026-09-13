const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, university, bio } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: "Name, email, password and role are required" });
    if (!["Student", "Professional"].includes(role)) return res.status(400).json({ message: "Invalid role" });
    if (await User.findOne({ email })) return res.status(409).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash, role, university, bio });
    res.status(201).json({ token: sign(user._id), user: { ...user.toObject(), password: undefined } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password" });
    res.json({ token: sign(user._id), user: { ...user.toObject(), password: undefined } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
