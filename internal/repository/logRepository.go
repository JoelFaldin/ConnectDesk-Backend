package repository

import "database/sql"

type LogRepository struct {
	db *sql.DB
}

func NewLogRepository(db *sql.DB) *LogRepository {
	return &LogRepository{db: db}
}

func (h *LogRepository) GetAllLogs() (*sql.Rows, error) {
	return h.db.Query("SELECT COUNT(*) FROM log")
}
