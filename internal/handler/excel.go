package handler

import (
	"fmt"
	"net/http"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type ExcelHandler struct {
	service     *service.ExcelService
	logService  *service.LogService
	userService *service.UserService
}

func NewExcelHandler(s *service.ExcelService, l *service.LogService, u *service.UserService) *ExcelHandler {
	return &ExcelHandler{service: s, logService: l, userService: u}
}

func (h *ExcelHandler) RegisterRoutes(r *gin.Engine) {
	excel := r.Group("api/excel")
	excel.GET("/template", h.GetTemplate)
	excel.GET("/download", h.DownloadFile)
	excel.GET("/download/logs", h.DownloadLogs)
	excel.GET("/summary", h.GetSummary)
	excel.POST("/upload", h.UploadFile)
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

func (h *ExcelHandler) DownloadFile(c *gin.Context) {
	file, err := h.service.DownloadFile()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", "userdata.xlsx"))
	c.Header("Content-Transfer-Encoding", "binary")

	if err := file.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
}

func (h *ExcelHandler) DownloadLogs(c *gin.Context) {
	file, err := h.service.DownloadLogsFile()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", "logs.xlsx"))
	c.Header("Content-Transfer-Encoding", "binary")

	if err := file.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}
}

func (h *ExcelHandler) GetSummary(c *gin.Context) {
	successCodes := []int{200, 201}
	errorCodes := []int{400, 500}

	successCount, err := h.service.CountOperations(successCodes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	errorCount, err := h.service.CountOperations(errorCodes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"successCount": successCount,
		"errorCount":   errorCount,
	})
}

func (h *ExcelHandler) UploadFile(c *gin.Context) {
	file, err := c.FormFile("excelFile")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	err = h.service.UploadExcelData(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"response": "Data saved in the database!",
	})
}
