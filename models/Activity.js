const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  action:    { type: String, enum: ["read", "download", "login"] }, 
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" }
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);