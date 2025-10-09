const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Directory where uploads are stored
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve uploaded files statically
app.use("/uploads", express.static(uploadDir));

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// --- File upload route ---
app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
        const filePath = path.join(uploadDir, req.file.filename);

        // Call FastAPI for analysis
        const response = await axios.post("http://127.0.0.1:8000/analyze", {
            path: filePath,
        });

        res.json({
            message: "uploaded and analyzed successfully",
            filename: req.file.filename,
            analysis: response.data,
        });
    } catch (err) {
        console.error("Error uploading or analyzing image:", err.message);
        res.status(500).json({ error: "Upload failed" });
    }
});

// --- Endpoint to fetch all uploaded images ---
app.get("/api/images", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to scan uploads folder" });
        }
        res.json(files);
    });
});

// --- NEW: Search endpoint ---
app.get("/api/search", (req, res) => {
    const query = req.query.q?.toLowerCase();
    if (!query) {
        return res.status(400).json({ error: "Missing search query" });
    }

    const analysisFile = path.join(uploadDir, "analysis.json");
    if (!fs.existsSync(analysisFile)) {
        return res.json([]);
    }

    try {
        const data = JSON.parse(fs.readFileSync(analysisFile, "utf-8"));
        const results = data.filter((entry) =>
            entry.results.some((r) => r.label.toLowerCase().includes(query))
        );

        res.json(results);
    } catch (err) {
        console.error("Error reading analysis.json:", err);
        res.status(500).json({ error: "Error reading analysis data" });
    }
});

// --- Start server ---
app.listen(PORT, () => {
    console.log(`Express listening on port ${PORT}`);
});
