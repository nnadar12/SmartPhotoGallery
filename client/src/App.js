import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  // Fetch uploaded images from Express server
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/images");
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      fetchImages(); // refresh gallery
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Smart Photo Gallery</h2>

      {/* File Upload */}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      {/* Image Gallery */}
      <h3>Uploaded Images</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={`http://localhost:5000/uploads/${img}`}
            alt={img}
            width="200"
            style={{ borderRadius: "8px" }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
