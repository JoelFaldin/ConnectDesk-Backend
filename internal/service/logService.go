package service

import (
	"database/sql"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/repository"
)

type LogService struct {
	logRepo *repository.LogRepository
}

func NewLogService(logRepo *repository.LogRepository) *LogService {
	return &LogService{logRepo: logRepo}
}

func (h *LogService) GetSummary() (*sql.Rows, error) {
	res, err := h.logRepo.Count()
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (h *LogService) GetAllLogs() (*sql.Rows, error) {
	res, err := h.logRepo.GetAllLogs()
	if err != nil {
		return nil, err
	}

	return res, nil
}
