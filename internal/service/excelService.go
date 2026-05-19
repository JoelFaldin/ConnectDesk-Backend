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

	// headers := [9]string{"Rut", "Names", "Lastnames", "Email", "Role", "Departments", "Directions", "Job Number", "Contact"}
	file.SetSheetRow("template", "A1", &[]interface{}{"Rut", "Names", "Lastnames", "Email", "Role", "Departments", "Directions", "Job Number", "Contact"})

	file.SetActiveSheet(index)

	if err := file.SaveAs("template.xlsx"); err != nil {
		fmt.Println(err)
	}

	return file, nil
}
