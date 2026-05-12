package main

import (
	"log"
	"net"
	"net/http"

	_ "github.com/mattn/go-sqlite3"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/config"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/handler"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/repository"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Database config:
	db := config.ConfigureDb()

	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)

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
	router.GET("/users/summary", userHandler.GetSummary)
	router.GET("/users", userHandler.GetUsers)

	http.ListenAndServe(addr, router)

	defer db.Close()
}
