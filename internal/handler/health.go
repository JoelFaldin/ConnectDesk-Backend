package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type HealthHandler struct {
}

func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

func (h *HealthHandler) RegisterRoutes(r *gin.Engine) {
	health := r.Group("api/health")
	health.GET("", h.GetHealth)
}

func (h *HealthHandler) GetHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":     "ok",
		"statusCode": 200,
		"timeStamp":  time.Now(),
	})
}
