package repository

import (
	"database/sql"
	"fmt"
	"strings"
)

type LogRepository struct {
	db *sql.DB
}

func NewLogRepository(db *sql.DB) *LogRepository {
	return &LogRepository{db: db}
}

func (h *LogRepository) Count() (*sql.Rows, error) {
	return h.db.Query("SELECT COUNT(*) FROM log")
}

func (h *LogRepository) GetAllLogs() (*sql.Rows, error) {
	return h.db.Query("SELECT log_id, description, local_date_time FROM log")
}

func (h *LogRepository) CountOperations(term string, statusCodes []string) int {
	inClause := strings.Join(statusCodes, ",")
	query := fmt.Sprintf("SELECT COUNT(*) FROM log WHERE endpoint LIKE ? AND role IN (%s)", inClause)

	var count int
	h.db.QueryRow(query, term).Scan(&count)

	return count
}
