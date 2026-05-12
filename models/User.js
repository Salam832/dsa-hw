const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["Admin", "Uploader", "Reader"], 
    default: "Reader"
  },
  lastLogin: Date,        
  downloadCount: { type: Number, default: 0 },
  readCount:     { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);