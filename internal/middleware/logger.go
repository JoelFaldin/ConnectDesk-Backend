package middleware

import (
	"fmt"
	"slices"
	"strings"
	"time"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/service"
	"github.com/gin-gonic/gin"
)

func Logger(logService *service.LogService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Let request go to handler
		c.Next()

		start := time.Now()

		// Skip certain requests:
		exclude_paths := []string{"/api/users", "/api/users/summary", "/api/logs/summary", "/api/logs/all", "/api/logs", "/api/excel/summary", "/api/health"}
		contains := slices.ContainsFunc(exclude_paths, func(s string) bool {
			return strings.Contains(c.Request.URL.Path, s)
		})

		if contains {
			return
		}

		// Post-handler operations:
		endpoint := c.Request.URL.Path
		method := c.Request.Method
		// status_code := c.Request.Response.StatusCode

		// Time calculations:
		start_time := time.Since(start)

		desc := fmt.Sprintf("%s in %s. Done in %s", method, endpoint, start_time)
		fmt.Println(endpoint, method, start)
		fmt.Println(desc)
	}
}
