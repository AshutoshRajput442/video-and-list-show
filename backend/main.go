package main

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func initDB() {
	var err error
	dsn := "root:root@tcp(127.0.0.1:3306)/video_db"
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Database connection error:", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal("Database not reachable:", err)
	}
	fmt.Println("Connected to MySQL")
}

func uploadVideoBlob(c *gin.Context) {
	file, header, err := c.Request.FormFile("video")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file"})
		return
	}
	defer file.Close()

	videoData, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}

	result, err := db.Exec("INSERT INTO videos_blob (filename, data) VALUES (?, ?)", header.Filename, videoData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store video in database"})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusOK, gin.H{"message": "Video uploaded successfully", "id": id})
}

func serveVideoBlob(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid video ID"})
		return
	}

	var filename string
	var data []byte
	err = db.QueryRow("SELECT filename, data FROM videos_blob WHERE id = ?", id).Scan(&filename, &data)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
		return
	}

	c.Header("Content-Type", "video/mp4")
	c.Header("Content-Disposition", fmt.Sprintf("inline; filename=\"%s\"", filename))
	c.Data(http.StatusOK, "video/mp4", data)
}

func listVideos(c *gin.Context) {
	rows, err := db.Query("SELECT id, filename FROM videos_blob")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer rows.Close()

	var videos []map[string]interface{}
	for rows.Next() {
		var id int
		var filename string
		if err := rows.Scan(&id, &filename); err == nil {
			videos = append(videos, map[string]interface{}{"id": id, "filename": filename})
		}
	}
	c.JSON(http.StatusOK, videos)
}

func main() {
	initDB()

	r := gin.Default()

	// CORS Middleware को Add करें
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // React App का Origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	// Routes
	r.POST("/upload-blob", uploadVideoBlob)
	r.GET("/video-blob/:id", serveVideoBlob)
	r.GET("/videos-blob", listVideos)

	r.Run(":8080")
}
