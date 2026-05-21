package handler

import (
	"fmt"
	"net/http"
	"strconv"

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
	log.GET("/:code", h.FilterLogs)
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

func (h *LogHandler) FilterLogs(c *gin.Context) {
	code := c.Param("code")
	statusCode, err := strconv.Atoi(code)
	if err != nil {
		fmt.Println("converting")
		c.JSON(http.StatusBadRequest, gin.H{
			"response": err.Error(),
		})
		return
	}

	page := c.Query("page")
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		fmt.Println("converting 2")
		c.JSON(http.StatusBadRequest, gin.H{
			"response": err.Error(),
		})
		return
	}

	pageSize := c.Query("pageSize")
	pageSizeInt, err := strconv.Atoi(pageSize)
	if err != nil {
		fmt.Println("converting 3")
		c.JSON(http.StatusBadRequest, gin.H{
			"response": err.Error(),
		})
		return
	}

	if statusCode == 1 {
		response, total, err := h.logService.FindAllLogs(pageInt, pageSizeInt)
		if err != nil {
			fmt.Println("test1")
			c.JSON(http.StatusInternalServerError, gin.H{
				"response": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"content":  response,
			"pageSize": pageSizeInt,
			"page":     pageInt,
			"total":    total,
		})
	} else {
		response, total, err := h.logService.FindByCode(statusCode, pageInt, pageSizeInt)
		if err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{
				"response": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"content":  response,
			"pageSize": pageSizeInt,
			"page":     pageInt,
			"total":    total,
		})
	}
}
