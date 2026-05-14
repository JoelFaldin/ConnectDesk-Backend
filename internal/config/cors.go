package config

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Cors() gin.HandlerFunc {
	frontPort := os.Getenv("FRONTEND_PORT")

	if frontPort == "" {
		log.Fatal("No frontend port provided.")
	}

	return cors.New(cors.Config{
		AllowOrigins: []string{frontPort},
		AllowMethods: []string{"GET", "POST", "PATCH", "DELETE"},
		AllowHeaders: []string{"Content-Type"},
	})
}
