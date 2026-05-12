const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Content = require("../models/Content");
const Activity = require("../models/Activity");
const { protect, authorize } = require("../middleware/auth");

// إعداد رفع الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET — عرض الملف الحقيقي
router.get("/:id/view", protect, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content || !content.fileUrl) 
      return res.status(404).json({ message: "الملف غير موجود" });
    
    // تسجيل القراءة
    await Content.findByIdAndUpdate(req.params.id, { $inc: { readCount: 1 } });
    await Activity.create({ userId: req.user._id, action: "read", contentId: content._id });
    
    // فتح الملف
    res.sendFile(path.resolve(content.fileUrl));
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// GET — تحميل + تسجيل نشاط download
router.get("/:id/download", protect, async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    await Activity.create({ 
      userId: req.user._id, 
      action: "download", 
      contentId: content._id 
    });
    res.json({ message: "تم التحميل", downloadCount: content.downloadCount });
  } catch {
    res.status(404).json({ message: "Not found" });
  }
});
// GET — جلب كل المحتوى
router.get("/", protect, async (req, res) => {
  const contents = await Content.find().populate("addedBy", "name");
  res.json(contents);
});

// POST — رفع محتوى (Uploader & Admin فقط)
router.post("/", protect, authorize("Admin", "Uploader"), upload.single("file"), async (req, res) => {
  try {
    const { title, description, type, author, category, keywords } = req.body;
    const content = await Content.create({
      title, description, type, author, category,
      keywords: keywords?.split(","),
      fileUrl: req.file?.path,
      fileType: req.body.fileType,
      addedBy: req.user._id
    });
    res.status(201).json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET — بحث متقدم
router.get("/search", protect, async (req, res) => {
  const { q, category, author } = req.query;
  const filter = {};
  if (q)        filter.$text = { $search: q };
  if (category) filter.category = category;
  if (author)   filter.author = new RegExp(author, "i");

  const results = await Content.find(filter);
  res.json(results);
});

// GET — قراءة عنصر + تسجيل نشاط
router.get("/:id", protect, async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { $inc: { readCount: 1 } },
      { new: true }
    );
    await Activity.create({ userId: req.user._id, action: "read", contentId: content._id });
    res.json(content);
  } catch {
    res.status(404).json({ message: "Not found" });
  }
});

// PUT — تعديل
router.put("/:id", protect, authorize("Admin", "Uploader"), async (req, res) => {
  const updated = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE — حذف (Admin فقط)
router.delete("/:id", protect, authorize("Admin"), async (req, res) => {
  await Content.findByIdAndDelete(req.params.id);
  res.json({ message: "Content deleted successfully" });
});

module.exports = router; 