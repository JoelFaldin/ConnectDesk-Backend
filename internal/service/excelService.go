package service

import (
	"fmt"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/model"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/repository"
	"github.com/xuri/excelize/v2"
)

type ExcelService struct {
	userRepo *repository.UserRepository
	logRepo  *repository.LogRepository
}

func NewExcelService(userRepo *repository.UserRepository, logRepo *repository.LogRepository) *ExcelService {
	return &ExcelService{userRepo: userRepo, logRepo: logRepo}
}

func (h *ExcelService) GenerateTemplate() (*excelize.File, error) {
	return createExcelFile(nil)
}

func (h *ExcelService) DownloadFile() (*excelize.File, error) {
	res, err := h.userRepo.GetUsers()
	if err != nil {
		return nil, err
	}

	var users []model.UserData
	for res.Next() {
		var u model.UserData

		if err := res.Scan(&u.Departmens, &u.Directions, &u.JobNumber, &u.Contact, &u.Rut, &u.Names, &u.Lastnames, &u.Email, &u.Role); err != nil {
			return nil, err
		}

		users = append(users, u)
	}

	return createExcelFile(users)
}

func (h *ExcelService) DownloadLogsFile() (*excelize.File, error) {
	res, err := h.logRepo.GetAllLogs()
	if err != nil {
		return nil, err
	}

	var logs []model.LogModel
	for res.Next() {
		var l model.LogModel

		if err := res.Scan(&l.Log_id, &l.Endpoint, &l.Method, &l.Status_Code, &l.Description, &l.Local_date_time, &l.User_id); err != nil {
			return nil, err
		}

		logs = append(logs, l)
	}

	return createLogExcelFile(logs)
}

func createExcelFile(userData []model.UserData) (*excelize.File, error) {
	// Configuring file:
	file := excelize.NewFile()
	defer func() {
		if err := file.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	index, err := file.NewSheet("template")
	if err != nil {
		return nil, err
	}

	// Set headers:
	err = file.SetSheetRow("template", "A1", &[]any{"Rut", "Names", "Lastnames", "Email", "Role", "Departments", "Directions", "Job Number", "Contact"})
	if err != nil {
		return nil, err
	}

	colWidths := []struct {
		col    string
		header string
		length int
	}{
		{"A", "Rut", 14},
		{"C", "Lastnames", len("Lastnames") + 2},
		{"D", "Email", len("Email") + 14},
		{"F", "Departments", len("Departments") + 2},
		{"G", "Directions", len("Directions") + 2},
		{"H", "Job Number", len("Job Number") + 2},
		{"I", "Contact", len("Contact") + 6},
	}

	for _, cw := range colWidths {
		if err := file.SetColWidth("template", cw.col, cw.col, float64(cw.length)); err != nil {
			return nil, err
		}
	}

	// Style headers:
	style, err := file.NewStyle(&excelize.Style{
		Fill: excelize.Fill{Type: "pattern", Color: []string{"#B2B2B2"}, Pattern: 1},
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 1},
			{Type: "top", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
		},
	})
	if err != nil {
		return nil, err
	}

	headerCells := []struct {
		col    string
		header string
	}{
		{"A", "Rut"},
		{"B", "Names"},
		{"C", "Lastnames"},
		{"D", "Email"},
		{"E", "Role"},
		{"F", "Departments"},
		{"G", "Directions"},
		{"H", "Job Number"},
		{"I", "Contact"},
	}

	for _, hc := range headerCells {
		location := fmt.Sprintf("%s1", hc.col)
		if err := file.SetCellStyle("template", location, location, style); err != nil {
			return nil, err
		}
	}

	// Setting data:
	if len(userData) != 0 {
		for i, u := range userData {
			row := i + 2
			cell, _ := excelize.CoordinatesToCellName(1, row)
			file.SetSheetRow("template", cell, &[]any{
				u.Rut,
				u.Names,
				u.Lastnames,
				u.Email,
				u.Role,
				u.Departmens,
				u.Directions,
				u.JobNumber,
				u.Contact,
			})
		}
	}

	// Preparing file for return:
	file.SetActiveSheet(index)

	if err := file.SaveAs("template.xlsx"); err != nil {
		return nil, err
	}

	return file, nil
}

func createLogExcelFile(logsData []model.LogModel) (*excelize.File, error) {
	// Configuring file:
	file := excelize.NewFile()
	defer func() {
		if err := file.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	index, err := file.NewSheet("logs")
	if err != nil {
		return nil, err
	}

	// Set headers:
	err = file.SetSheetRow("logs", "A1", &[]any{"Log id", "Endpoint", "Method", "Status Code", "Description", "Local date", "User id"})
	if err != nil {
		return nil, err
	}

	colWidths := []struct {
		col    string
		header string
		length int
	}{
		{"B", "Endpoint", len("Endpoint") + 8},
		{"C", "Method", len("Method") + 2},
		{"D", "Status Code", len("Status Code") + 2},
		{"E", "Description", len("Description") + 2},
		{"F", "Local date", len("Local date") + 8},
	}

	for _, cw := range colWidths {
		if err := file.SetColWidth("logs", cw.col, cw.col, float64(cw.length)); err != nil {
			return nil, err
		}
	}

	// Style headers:
	style, err := file.NewStyle(&excelize.Style{
		Fill: excelize.Fill{Type: "pattern", Color: []string{"#B2B2B2"}, Pattern: 1},
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 1},
			{Type: "top", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
		},
	})
	if err != nil {
		return nil, err
	}

	headerCells := []struct {
		col    string
		header string
	}{
		{"A", "Log id"},
		{"B", "Endpoint"},
		{"C", "Method"},
		{"D", "Status Code"},
		{"E", "Description"},
		{"F", "Local date"},
		{"G", "User id"},
	}

	for _, hc := range headerCells {
		location := fmt.Sprintf("%s1", hc.col)
		if err := file.SetCellStyle("logs", location, location, style); err != nil {
			return nil, err
		}
	}

	// Setting data:
	if len(logsData) != 0 {
		for i, l := range logsData {
			row := i + 2
			cell, _ := excelize.CoordinatesToCellName(1, row)
			file.SetSheetRow("logs", cell, &[]any{
				l.Log_id,
				l.Endpoint,
				l.Method,
				l.Status_Code,
				l.Description,
				l.Local_date_time,
				l.User_id,
			})
		}
	}

	// Preparing file for return:
	file.SetActiveSheet(index)

	if err := file.SaveAs("logs.xlsx"); err != nil {
		return nil, err
	}

	return file, nil
}
