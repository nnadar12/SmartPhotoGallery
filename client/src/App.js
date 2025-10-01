import React, { useState } from "react";
import axios from "axios";

function App() {
	  const [file, setFile] = useState(null);
	  const [message, setMessage] = useState("");

	  const handleFileChange = (e) => {
		      setFile(e.target.files[0]);
		    };

	  const handleUpload = async () => {
		      if (!file) {
			            setMessage("Please select a file first.");
			            return;
			          }

		      const formData = new FormData();
		      formData.append("file", file);

		      try {
			            const res = await axios.post("http://localhost:5000/api/upload", formData, {
					            headers: { "Content-Type": "multipart/form-data" },
					          });
			            setMessage(res.data);
			          } catch (err) {
					        console.error(err);
					        setMessage("Upload failed.");
					      }
		    };

	  return (
		      <div style={{ padding: "20px", fontFamily: "Arial" }}>
		        <h2>Smart Photo Gallery – Test Upload</h2>
		        <input type="file" onChange={handleFileChange} />
		        <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
		          Upload
		        </button>
		        <p>{message}</p>
		      </div>
		    );
}

export default App;
