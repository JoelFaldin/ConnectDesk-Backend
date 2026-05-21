package service

import (
	"fmt"
	"mime/multipart"
	"strconv"

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
	rowValues := &[]string{"Rut", "Names", "Lastnames", "Email", "Role", "Departments", "Directions", "Job Number", "Contact"}
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

	return createExcelFile(nil, "template.xlsx", "template", rowValues, colWidths, headerCells)
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

	// Data preparation for createExcelFile:
	matrix := make([][]any, len(users))
	for i, u := range users {
		matrix[i] = []any{
			u.Rut,
			u.Names,
			u.Lastnames,
			u.Email,
			u.Role,
			u.Departmens,
			u.Directions,
			u.JobNumber,
			u.Contact,
		}
	}

	rowValues := &[]string{"Rut", "Names", "Lastnames", "Email", "Role", "Departments", "Directions", "Job Number", "Contact"}
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

	return createExcelFile(matrix, "users.xlsx", "users", rowValues, colWidths, headerCells)
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

	// Data preparation for createExcelFile:
	matrix := make([][]any, len(logs))
	for i, l := range logs {
		matrix[i] = []any{
			l.Log_id,
			l.Endpoint,
			l.Method,
			l.Status_Code,
			l.Description,
			l.Local_date_time,
			l.User_id,
		}
	}

	rowValues := &[]string{"Log id", "Endpoint", "Method", "Status Code", "Description", "Local date", "User id"}
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
	return createExcelFile(matrix, "logs.xlsx", "logs", rowValues, colWidths, headerCells)
}

func createExcelFile(matrix [][]any, fileName, sheetName string, rowValues *[]string, colWidths []struct {
	col    string
	header string
	length int
}, headerCells []struct {
	col    string
	header string
}) (*excelize.File, error) {
	// Configuring file:
	file := excelize.NewFile()
	defer func() {
		if err := file.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	index, err := file.NewSheet(sheetName)
	if err != nil {
		return nil, err
	}

	// Set headers:
	err = file.SetSheetRow(sheetName, "A1", rowValues)
	if err != nil {
		return nil, err
	}

	for _, cw := range colWidths {
		if err := file.SetColWidth(sheetName, cw.col, cw.col, float64(cw.length)); err != nil {
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

	for _, hc := range headerCells {
		location := fmt.Sprintf("%s1", hc.col)
		if err := file.SetCellStyle(sheetName, location, location, style); err != nil {
			return nil, err
		}
	}

	// Setting data:
	if len(matrix) != 0 {
		for i, rowData := range matrix {
			row := i + 2
			cell, _ := excelize.CoordinatesToCellName(1, row)
			file.SetSheetRow(sheetName, cell, &rowData)
		}
	}

	// Preparing file for return:
	file.SetActiveSheet(index)

	if err := file.SaveAs(fileName); err != nil {
		fmt.Println(fileName)
		return nil, err
	}

	return file, nil
}

func (h *ExcelService) CountOperations(statusCodes []int) (int, error) {
	strCodes := make([]string, len(statusCodes))

	for i, code := range statusCodes {
		strCodes[i] = strconv.Itoa(code)
	}

	res := h.logRepo.CountOperations("excel", strCodes)
	return res, nil
}

// Extract data from the excel file and save it into db
func (h *ExcelService) UploadExcelData(f *multipart.FileHeader) error {
	file, err := f.Open()
	if err != nil {
		return err
	}

	workbook, err := excelize.OpenReader(file)
	if err != nil {
		return err
	}
	defer workbook.Close()

	rows, err := workbook.GetRows("users")
	if err != nil {
		return err
	}

	err = h.userRepo.SaveBatch(rows)
	if err != nil {
		return err
	}

	return nil
}
