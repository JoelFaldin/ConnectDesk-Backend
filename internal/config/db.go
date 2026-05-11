package config

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"
)

func ConfigureDb() {
	if err := os.MkdirAll("./data", 0755); err != nil {
		log.Fatal(err)
	}

	absPath, _ := filepath.Abs("./data/sqliteApp.db")

	db, err := sql.Open("sqlite3", absPath)
	if err != nil {
		log.Fatal("Couldnt connect to db: ", err)
	}
	defer db.Close()

	// Check if db is alive:
	if err = db.Ping(); err != nil {
		log.Fatal("Database isnt working: ", err)
	}
}
