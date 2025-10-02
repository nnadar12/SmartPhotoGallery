const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// --- Multer setup for file uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// --- Enable CORS so React frontend can talk to Express ---
const cors = require("cors");
app.use(cors());

// --- Serve uploaded images as static files ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Test route ---
app.get("/", (req, res) => {
  res.send("Hello World from Express server!");
});

// --- Upload endpoint ---
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.json({ message: "Uploaded successfully", filename: req.file.filename });
});

// --- Endpoint to get list of uploaded files ---
app.get("/api/images", (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads");

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read uploads folder" });
    }

    // Only return image files
    const imageFiles = files.filter((f) =>
      f.match(/\.(jpg|jpeg|png|gif)$/i)
    );

    res.json(imageFiles);
  });
});

// --- Start server ---
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});
