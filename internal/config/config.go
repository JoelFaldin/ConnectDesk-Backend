package config

import (
	"os"
)

func Config() (port string) {
	// Get port:
	port = os.Getenv("PORT")

	if port != "" {
		port = "3000"
	}

	return port
}
