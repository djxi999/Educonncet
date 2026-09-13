require("dotenv").config();
const http = require("http");
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const resourceRoutes = require("./routes/resource.routes");
const jobRoutes = require("./routes/job.routes");
const connectionRoutes = require("./routes/connection.routes");
const messageRoutes = require("./routes/message.routes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" }
});
app.set("io", io);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true, message: "EduConnect API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    if (userId) socket.join(`user:${userId}`);
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => console.log(`EduConnect backend running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
