const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Content = require("../models/Content");
const Activity = require("../models/Activity");
const { protect, authorize } = require("../middleware/auth");

// File Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// GET — Display the file + Record reading activity
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

// GET — Download the file + Record download activity
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

// GET — Fetch all the content
router.get("/", protect, async (req, res) => {
  try {
    const contents = await Content.find().populate("addedBy", "name");
    res.json(contents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — Upload new content 
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

// GET — Advanced search
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

// GET — Bring one item and record reading
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

// PUT — Update
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

// DELETE 
router.delete("/:id", protect, authorize("Admin"), async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;