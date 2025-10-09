import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [viewAll, setViewAll] = useState(true);

  const API_URL = "http://localhost:5000";

  // Fetch all images initially
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/images`);
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Image uploaded successfully!");
      fetchImages();
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search term.");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/search?q=${searchQuery}`);
      setSearchResults(res.data);
      setViewAll(false);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed.");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setViewAll(true);
  };

  const imagesToDisplay = viewAll
    ? images.map((img) => ({ image: img }))
    : searchResults;

  return (
    <div className="App">
      <h1>Smart Photo Gallery</h1>

      {/* Upload Section */}
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by background (e.g. lake, mountain)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleClearSearch}>View All</button>
      </div>

      {/* Gallery Section */}
      <div className="gallery-grid">
        {imagesToDisplay.length === 0 ? (
          <p>No images found.</p>
        ) : (
          imagesToDisplay.map((imgData, idx) => (
            <div key={idx} className="image-card">
              <img
                src={`${API_URL}/uploads/${imgData.image}`}
                alt="Uploaded"
                className="gallery-img"
              />
              {!viewAll && imgData.results && (
                <div className="labels">
                  {imgData.results.map((r, i) => (
                    <span key={i}>{r.label}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
