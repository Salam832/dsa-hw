const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Content = require("../models/Content");
const Activity = require("../models/Activity");
const { protect, authorize } = require("../middleware/auth");

// إعداد رفع الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// GET — عرض الملف الحقيقي + تسجيل قراءة
router.get("/:id/view", protect, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content || !content.fileUrl) {
      return res.status(404).json({ message: "File not found in database" });
    }

    const filePath = path.resolve(content.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File does not exist on server" });
    }

    await Content.findByIdAndUpdate(req.params.id, {
      $inc: { readCount: 1 },
    });

    await Activity.create({
      userId: req.user._id,
      action: "read",
      contentId: content._id,
    });

    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET — تحميل الملف الحقيقي + تسجيل نشاط download
router.get("/:id/download", protect, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content || !content.fileUrl) {
      return res.status(404).json({ message: "File not found in database" });
    }

    const filePath = path.resolve(content.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File does not exist on server" });
    }

    await Content.findByIdAndUpdate(req.params.id, {
      $inc: { downloadCount: 1 },
    });

    await Activity.create({
      userId: req.user._id,
      action: "download",
      contentId: content._id,
    });

    res.download(filePath, path.basename(filePath));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET — جلب كل المحتوى
router.get("/", protect, async (req, res) => {
  try {
    const contents = await Content.find().populate("addedBy", "name");
    res.json(contents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — رفع محتوى جديد
router.post(
  "/",
  protect,
  authorize("Admin", "Uploader"),
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, description, type, author, category, keywords } = req.body;

      const content = await Content.create({
        title,
        description,
        type,
        author,
        category,
        keywords: keywords ? keywords.split(",").map((k) => k.trim()) : [],
        fileUrl: req.file?.path,
        fileType: type,
        addedBy: req.user._id,
      });

      res.status(201).json(content);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET — بحث متقدم
router.get("/search", protect, async (req, res) => {
  try {
    const { q, category, author } = req.query;
    const filter = {};

    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (author) filter.author = new RegExp(author, "i");

    const results = await Content.find(filter);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET — جلب عنصر واحد + تسجيل قراءة
router.get("/:id", protect, async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { $inc: { readCount: 1 } },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: "Not found" });
    }

    await Activity.create({
      userId: req.user._id,
      action: "read",
      contentId: content._id,
    });

    res.json(content);
  } catch (err) {
    res.status(404).json({ message: "Not found" });
  }
});

// PUT — تعديل
router.put("/:id", protect, authorize("Admin", "Uploader"), async (req, res) => {
  try {
    const updated = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE — حذف
router.delete("/:id", protect, authorize("Admin"), async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;