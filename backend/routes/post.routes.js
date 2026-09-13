const router = require("express").Router();
const Post = require("../models/Post");
const { auth } = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const posts = await Post.find().populate("author", "name role university avatar").populate("comments.user", "name").sort("-createdAt").limit(50);
  res.json(posts);
});

router.post("/", auth, async (req, res) => {
  const post = await Post.create({ author: req.user._id, text: req.body.text || "", image: req.body.image || "" });
  res.status(201).json(await post.populate("author", "name role university avatar"));
});

router.post("/:id/like", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  const index = post.likes.findIndex(id => id.toString() === req.user._id.toString());
  if (index >= 0) post.likes.splice(index, 1); else post.likes.push(req.user._id);
  await post.save();
  res.json(post);
});

router.post("/:id/comments", auth, async (req, res) => {
  if (!req.body.text?.trim()) return res.status(400).json({ message: "Comment is required" });
  const post = await Post.findById(req.params.id);
  post.comments.push({ user: req.user._id, text: req.body.text });
  await post.save();
  await post.populate("comments.user", "name");
  res.json(post);
});

module.exports = router;
