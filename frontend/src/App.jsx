// import { useState, useEffect } from "react";
// import axios from "axios";

// function App() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [videos, setVideos] = useState([]);    // Use [] not null
//   const [playingVideo, setPlayingVideo] = useState(null);

//   const fetchVideos = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/videos-blob");
//       // Make sure this is an array in your backend response
//       setVideos(response.data);
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//       // Optionally, set an empty array on error
//       setVideos([]);
//     }
//   };

//   const uploadVideo = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       alert("Please select a video file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("video", selectedFile);

//     try {
//       await axios.post("http://localhost:8080/upload-blob", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Video uploaded successfully!");
//       setSelectedFile(null);
//       fetchVideos();
//     } catch (error) {
//       console.error("Error uploading video:", error);
//       alert("Failed to upload video.");
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   return (
//     <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "center" }}>
//       <h2>Video Upload and Streaming</h2>

//       {/* Upload Form */}
//       <form onSubmit={uploadVideo}>
//         <input
//           type="file"
//           accept="video/*"
//           onChange={(e) => setSelectedFile(e.target.files[0])}
//         />
//         <button type="submit">Upload</button>
//       </form>

//       <hr />

//       {/* List of Videos */}
//       <h3>Available Videos</h3>
//       {videos.length === 0 && <p>No videos uploaded yet.</p>}
//       <ul>
//         {videos.map((video) => (
//           <li key={video.id}>
//             {video.filename}{" "}
//             <button onClick={() => setPlayingVideo(video.id)}>Play</button>
//           </li>
//         ))}
//       </ul>

//       {/* Video Player */}
//       {playingVideo && (
//         <div>
//           <h3>Now Playing:</h3>
//           <video width="100%" controls>
//             <source
//               src={`http://localhost:8080/video-blob/${playingVideo}`}
//               type="video/mp4"
//             />
//             Your browser does not support the video tag.
//           </video>
//           <button onClick={() => setPlayingVideo(null)}>Close</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import First from "./components/First";
import Second from "./components/Second";

function App() {
  return (
    <Routes>
      {/* Upload Page */}
      <Route path="/" element={<First />} />

      {/* Videos Page */}
      <Route path="/videos" element={<Second />} />
    </Routes>
  );
}

export default App;
