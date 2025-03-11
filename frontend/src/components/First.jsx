// src/First.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function First() {
  const [selectedFile, setSelectedFile] = useState(null);

  const uploadVideo = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a video file");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      await axios.post("http://localhost:8080/upload-blob", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video.");
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "2rem" }}>
      <h2>Upload Page</h2>
      <form onSubmit={uploadVideo}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>

      <hr />
      <Link to="/videos">Go to Videos Page</Link>
    </div>
  );
}

export default First;
