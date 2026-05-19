const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: String,
  type:        String,
  author:      String,
  category:    String,
  fileUrl:     String,

  fileType: { type: String },

  keywords:    [String],
  addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  downloadCount: { type: Number, default: 0 },
  readCount:     { type: Number, default: 0 }
}, { timestamps: true });

contentSchema.index({
  title: "text",
  author: "text",
  keywords: "text",
  description: "text"
});

module.exports = mongoose.model("Content", contentSchema);