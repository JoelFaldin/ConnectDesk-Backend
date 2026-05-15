package handler

import (
	"net/http"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type LogHandler struct {
	logService *service.LogService
}

func NewLogHandler(s *service.LogService) *LogHandler {
	return &LogHandler{logService: s}
}

func (h *LogHandler) RegisterRoutes(r *gin.Engine) {
	log := r.Group("api/logs")
	log.GET("/summary", h.GetSummary)
	log.GET("/all", h.GetAllLogs)
}

func (h *LogHandler) GetSummary(c *gin.Context) {
	res, err := h.logService.GetSummary()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"response": "Error counting logs, try again later",
		})

		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *LogHandler) GetAllLogs(c *gin.Context) {
	res, err := h.logService.GetAllLogs()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"response": "Error getting all logs, try again later",
		})

		return
	}

	c.JSON(http.StatusOK, res)
}
