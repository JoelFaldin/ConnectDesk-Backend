package handler

import (
	"fmt"
	"net/http"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type ExcelHandler struct {
	service *service.ExcelService
}

func NewExcelHandler(s *service.ExcelService) *ExcelHandler {
	return &ExcelHandler{service: s}
}

func (h *ExcelHandler) RegisterRoutes(r *gin.Engine) {
	excel := r.Group("api/excel")
	excel.GET("/download", h.GetTemplate)
}

func (h *ExcelHandler) GetTemplate(c *gin.Context) {
	file, err := h.service.GenerateTemplate()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", "template.xlsx"))
	c.Header("Content-Transfer-Encoding", "binary")

	if err := file.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
}
