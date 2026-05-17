const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const path = require("path");
const connectDB = require("./config/db");

const contentRoutes = require("./routes/content");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(">>>", req.method, req.url);
  next();
});

app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/content", contentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

//  ربط الفرونت
// app.use(express.static("D:/SVU/DigitaLibrary/frontend"));

// app.get("/", (req, res) => {
//   res.sendFile("D:/SVU/DigitaLibrary/frontend/index.html");
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));