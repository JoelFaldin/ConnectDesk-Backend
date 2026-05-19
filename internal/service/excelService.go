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

	err = file.SetSheetRow("template", "A1", &[]any{"Rut", "Names", "Lastnames", "Email", "Role", "Departments", "Directions", "Job Number", "Contact"})
	if err != nil {
		return nil, err
	}

	err = file.SetColWidth("template", "C", "C", float64(len("Lastnames")+2))
	err = file.SetColWidth("template", "F", "F", float64(len("Departments")+2))
	err = file.SetColWidth("template", "G", "G", float64(len("Directions")+2))
	err = file.SetColWidth("template", "H", "H", float64(len("Job Number")+2))
	if err != nil {
		return nil, err
	}

	file.SetActiveSheet(index)

	if err := file.SaveAs("template.xlsx"); err != nil {
		fmt.Println(err)
	}

	return file, nil
}
