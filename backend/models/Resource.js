const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  subject: { type: String, required: true, index: true },
  university: { type: String, default: "", index: true },
  category: { type: String, enum: ["Notes", "Guide", "Question Paper", "Other"], default: "Notes" },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

resourceSchema.index({ title: "text", description: "text", subject: "text", university: "text" });
module.exports = mongoose.model("Resource", resourceSchema);
