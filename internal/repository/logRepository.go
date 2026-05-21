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

func (h *LogRepository) Count() *sql.Row {
	return h.db.QueryRow("SELECT COUNT(*) FROM log")
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

func (h *LogRepository) FindAllLogs(page, pageSize int) (*sql.Rows, error) {
	return h.db.Query("SELECT * FROM log LIMIT $1 OFFSET $2", pageSize, page)
}

func (h *LogRepository) FindByCode(statusCodes []string, page, pageSize int) (*sql.Rows, error) {
	inClaude := strings.Join(statusCodes, ",")
	query := fmt.Sprintf("SELECT * FROM log WHERE status_code IN (%s) LIMIT $1 OFFSET $2", inClaude)

	return h.db.Query(query, pageSize, page)
}
