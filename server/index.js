const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data'); // <-- Import FormData

const app = express();

// ... (your multer storage config remains the same)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });


app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);

    // Create a new form data instance
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath)); // 'file' must match FastAPI's parameter name

    // Forward file to FastAPI
    const response = await axios.post("http://localhost:8000/analyze", form, {
      headers: {
        ...form.getHeaders() // <-- This is the crucial part! It adds the Content-Type with the boundary.
      }
    });

    // Send FastAPI results back to client
    res.json({
      message: "Uploaded successfully",
      analysis: response.data
    });

  } catch (err) {
    // Provide more detailed error logging
    if (err.response) {
        console.error('Error from FastAPI server:', err.response.data);
    } else if (err.request) {
        console.error('No response received from FastAPI server:', err.request);
    } else {
        console.error('Error setting up the request:', err.message);
    }
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});
