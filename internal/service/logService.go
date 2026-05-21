package service

import (
	"database/sql"
	"fmt"
	"strconv"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/model"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/repository"
)

type LogService struct {
	logRepo *repository.LogRepository
}

func NewLogService(logRepo *repository.LogRepository) *LogService {
	return &LogService{logRepo: logRepo}
}

func (h *LogService) GetSummary() (int, error) {
	res := h.logRepo.Count()

	var total int
	err := res.Scan(&total)
	if err != nil {
		return 0, err
	}

	return total, nil
}

func (h *LogService) GetAllLogs() (*sql.Rows, error) {
	res, err := h.logRepo.GetAllLogs()
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (h *LogService) FindAllLogs(page, pageSize int) ([]model.LogModel, int, error) {
	res, err := h.logRepo.FindAllLogs(page, pageSize)
	if err != nil {
		return nil, -1, err
	}

	var logs []model.LogModel
	for res.Next() {
		var l model.LogModel

		if err := res.Scan(&l.Log_id, &l.Endpoint, &l.Method, &l.Status_Code, &l.Description, &l.Local_date_time, &l.User_id); err != nil {
			return nil, -1, err
		}

		logs = append(logs, l)
	}

	t := h.logRepo.Count()

	var total int
	err = t.Scan(&total)
	if err != nil {
		return nil, -1, err
	}

	return logs, total, nil
}

func (h *LogService) FindByCode(statusCode, page, pageSize int) ([]model.LogModel, int, error) {
	var statusCodes []int

	if statusCode == 400 {
		statusCodes = append(statusCodes, statusCode, 404, 500)
	} else {
		statusCodes = append(statusCodes, statusCode)
	}

	codes := make([]string, len(statusCodes))

	for i, v := range statusCodes {
		codes[i] = strconv.Itoa(v)
	}

	res, err := h.logRepo.FindByCode(codes, page, pageSize)
	if err != nil {
		fmt.Println("findByCode")
		return nil, -1, err
	}

	t := h.logRepo.Count()

	var total int
	err = t.Scan(&total)
	if err != nil {
		return nil, -1, err
	}

	var logs []model.LogModel
	for res.Next() {
		var l model.LogModel

		if err := res.Scan(&l.Log_id, &l.Endpoint, &l.Method, &l.Status_Code, &l.Description, &l.Local_date_time, &l.User_id); err != nil {
			return nil, -1, err
		}

		logs = append(logs, l)
	}

	return logs, total, nil
}
