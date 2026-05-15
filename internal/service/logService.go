package service

import (
	"database/sql"
	"fmt"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/repository"
)

type LogService struct {
	logRepo *repository.LogRepository
}

func NewLogService(logRepo *repository.LogRepository) *LogService {
	return &LogService{logRepo: logRepo}
}

func (h *LogService) GetSummary() (*sql.Rows, error) {
	res, err := h.logRepo.GetAllLogs()
	if err != nil {
		return nil, err
	}

	fmt.Println(res)

	return res, res.Err()
}
