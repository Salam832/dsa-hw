const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: String,
  type:        String,
  author:      String,           // مطلوب للبحث بالمؤلف
  category:    String,           // مطلوب للفلترة
  fileUrl:     String,           // مسار الملف المرفوع
  fileType:    { type: String, enum: ["PDF", "Image", "Audio"] }, // نوع الملف
  keywords:    [String],         //للبحث النصي
  addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  downloadCount: { type: Number, default: 0 },
  readCount:     { type: Number, default: 0 }
}, { timestamps: true });

//Text Search
contentSchema.index({ title: "text", author: "text", keywords: "text", description: "text" });

module.exports = mongoose.model("Content", contentSchema);