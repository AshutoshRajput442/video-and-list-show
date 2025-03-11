CREATE DATABASE IF NOT EXISTS video_db;
USE video_db;

CREATE TABLE IF NOT EXISTS videos_blob (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    data LONGBLOB NOT NULL
);
SELECT * FROM video_db.videos_blob;