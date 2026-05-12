package config

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/database"
)

func ConfigureDb() *sql.DB {
	if err := os.MkdirAll("./data", 0755); err != nil {
		log.Fatal(err)
	}

	absPath, err := filepath.Abs("./data/sqliteApp.db")
	if err != nil {
		log.Fatal("Couldnt resolve db path: ", err)
	}

	db := database.InitDB(absPath)

	return db
}
