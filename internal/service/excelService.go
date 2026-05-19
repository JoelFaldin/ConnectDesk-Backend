package service

import (
	"fmt"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/model"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/repository"
	"github.com/xuri/excelize/v2"
)

type ExcelService struct {
	userRepo *repository.UserRepository
}

func NewExcelService(userRepo *repository.UserRepository) *ExcelService {
	return &ExcelService{userRepo: userRepo}
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
		fmt.Println(err)
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
		fmt.Println(err)
	}

	return file, nil
}
