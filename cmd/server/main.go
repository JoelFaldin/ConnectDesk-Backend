package main

import (
	"log"
	"net"
	"net/http"

	_ "github.com/mattn/go-sqlite3"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/config"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/handler"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Database config:
	config.ConfigureDb()

	router := gin.Default()

	// Load Go configuration:
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Failed to load .env file")
	}

	host := ""
	port := config.Config()
	addr := net.JoinHostPort(host, port)

	// Cors:
	router.Use(config.Cors())

	// Route handlers:
	router.GET("/users", handler.GetUsers)

	http.ListenAndServe(addr, router)
}
