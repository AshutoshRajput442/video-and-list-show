// src/Second.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Second() {
  const [videos, setVideos] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/videos-blob");
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "2rem" }}>
      <h2>Videos Page</h2>
      <Link to="/">Go to Upload Page</Link>
      <hr />

      <h3>Available Videos</h3>
      {videos.length === 0 && <p>No videos uploaded yet.</p>}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {videos.map((video) => (
          <li key={video.id} style={{ marginBottom: "1rem" }}>
            {video.filename}{" "}
            <button onClick={() => setPlayingVideo(video.id)}>Play</button>
          </li>
        ))}
      </ul>

      {playingVideo && (
        <div>
          <h4>Now Playing (ID: {playingVideo})</h4>
          <video width="600" controls>
            <source
              src={`http://localhost:8080/video-blob/${playingVideo}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <br />
          <button onClick={() => setPlayingVideo(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Second;
