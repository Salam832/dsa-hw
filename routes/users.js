const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Activity = require("../models/Activity");
const { protect, authorize } = require("../middleware/auth");



// عداد الزوار — بدون توكن
router.get("/visitors/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// GET — إحصائيات مستخدم (آخر دخول + عدد القراءات + التحميلات)
router.get("/:id/stats", protect, authorize("Admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    const readCount = await Activity.countDocuments({ 
      userId: req.params.id, action: "read" 
    });
    const downloadCount = await Activity.countDocuments({ 
      userId: req.params.id, action: "download" 
    });
    const loginCount = await Activity.countDocuments({ 
      userId: req.params.id, action: "login" 
    });
    const recentActivity = await Activity.find({ userId: req.params.id })
      .populate("contentId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      user,
      stats: { readCount, downloadCount, loginCount },
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET — كل المستخدمين (Admin فقط)
router.get("/", protect, authorize("Admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// PUT — تغيير دور مستخدم (Admin فقط)
router.put("/:id/role", protect, authorize("Admin"), async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  ).select("-password");
  res.json(user);
});

// GET — نشاط مستخدم محدد
router.get("/:id/activity", protect, authorize("Admin"), async (req, res) => {
  const activities = await Activity.find({ userId: req.params.id })
    .populate("contentId", "title");
  res.json(activities);
});

module.exports = router;