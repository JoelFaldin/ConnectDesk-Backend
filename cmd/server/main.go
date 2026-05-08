package main

import (
	"log"
	"net"
	"net/http"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/config"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	router := gin.Default()

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// Load Go configuration:
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Failed to load .env file")
	}

	host := ""
	port := config.Config()
	addr := net.JoinHostPort(host, port)

	http.ListenAndServe(addr, router)
}
