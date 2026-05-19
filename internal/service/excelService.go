package service

import (
	"fmt"

	"github.com/xuri/excelize/v2"
)

type ExcelService struct {
}

func NewExcelService() *ExcelService {
	return &ExcelService{}
}

func (h *ExcelService) GenerateTemplate() (*excelize.File, error) {
	return createExcelFile()
}

func createExcelFile() (*excelize.File, error) {
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
	}{
		{"C", "Lastnames"},
		{"F", "Departments"},
		{"G", "Directions"},
		{"H", "Job Number"},
	}

	for _, cw := range colWidths {
		if err := file.SetColWidth("template", cw.col, cw.col, float64(len(cw.header)+2)); err != nil {
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

	// Preparing file for return:
	file.SetActiveSheet(index)

	if err := file.SaveAs("template.xlsx"); err != nil {
		fmt.Println(err)
	}

	return file, nil
}
