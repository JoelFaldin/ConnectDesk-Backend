package main

import (
	"log"
	"net"
	"net/http"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/config"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/handler"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	router := gin.Default()

	// Route handlers:
	router.GET("/users", handler.GetUsers)

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
