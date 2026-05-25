package config

import (
	"log"
	"os"
)

func Config() (port string) {
	// Get port:
	port = os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	return port
}

func JwtSecret() string {
	// Get secret:
	secret := os.Getenv("SECRET_KEY")

	if secret == "" {
		log.Fatal("No jwt secret provided")
	}

	return secret
}
