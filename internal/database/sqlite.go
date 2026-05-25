package database

import (
	"database/sql"
	"log"
)

func InitDB(filepath string) *sql.DB {
	db, err := sql.Open("sqlite3", filepath)
	if err != nil {
		log.Fatal("Couldnt connect to db: ", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal("Couldnt pint db: ", err)
	}

	createTables(db)

	return db
}

func createTables(db *sql.DB) {
	schema := `
		CREATE TABLE IF NOT EXISTS users (
			user_id INTEGER PRIMARY KEY AUTOINCREMENT,
			rut TEXT NOT NULL UNIQUE,
			names TEXT NOT NULL,
			lastnames TEXT NOT NULL,
			email TEXT NOT NULL,
			password TEXT NOT NULL,
			role TEXT NOT NULL,
			details INTEGER REFERENCES user_job_details,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS user_job_details (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			departments TEXT NOT NULL,
			directions TEXT NOT NULL,
			jobNumber TEXT NOT NULL,
			contact TEXT NOT NULL,
			user_rut TEXT REFERENCES users
		);

		CREATE TABLE IF NOT EXISTS log (
			log_id INTEGER PRIMARY KEY AUTOINCREMENT,
			endpoint TEXT NOT NULL,
			method TEXT NOT NULL,
			status_code INTEGER NOT NULL,
			description TEXT NOT NULL,
			local_date_time TEXT NOT NULL,
			user_id INTEGER REFERENCES users
		)
	`

	_, err := db.Exec(schema)
	if err != nil {
		log.Fatal("Failed to initialize db: ", err)
	}
}
