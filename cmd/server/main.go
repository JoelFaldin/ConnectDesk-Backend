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
	detailsRepo := repository.NewDetailsRepository(db)
	logRepository := repository.NewLogRepository(db)

	userService := service.NewUserService(userRepo, detailsRepo)
	authService := service.NewAuthService(userRepo, detailsRepo)
	logService := service.NewLogService(logRepository)
	excelService := service.NewExcelService(userRepo, logRepository)

	userHandler := handler.NewUserHandler(userService)
	authHandler := handler.NewAuthHandler(authService)
	healthHandler := handler.NewHealthHandler()
	logHandler := handler.NewLogHandler(logService)
	excelHandler := handler.NewExcelHandler(excelService)

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
	userHandler.RegisterRoutes(router)
	authHandler.RegisterRoutes(router)
	healthHandler.RegisterRoutes(router)
	logHandler.RegisterRoutes(router)
	excelHandler.RegisterRoutes(router)

	http.ListenAndServe(addr, router)

	defer db.Close()
}
