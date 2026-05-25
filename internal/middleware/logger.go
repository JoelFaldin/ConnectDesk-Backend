package middleware

import (
	"fmt"
	"slices"
	"strings"
	"time"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/config"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/service"
	"github.com/gin-gonic/gin"
)

func Logger(logService *service.LogService, userService *service.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// Let request go to handler
		c.Next()

		// Skip certain requests:
		exclude_paths := []string{"/api/users", "/api/users/summary", "/api/logs/summary", "/api/logs/all", "/api/logs", "/api/excel/summary", "/api/health", "/api/auth/register", "api/auth"}
		contains := slices.ContainsFunc(exclude_paths, func(s string) bool {
			return strings.Contains(c.Request.URL.Path, s)
		})

		if contains {
			return
		}

		// Post-handler operations:
		endpoint := c.Request.URL.Path
		method := c.Request.Method
		status_code := c.Writer.Status()

		user_email := config.DecodeJWT(c.Request.Header.Get("Authorization")[7:])
		user_id := userService.FindUser(user_email)

		// Time calculations:
		start_time := time.Since(start)

		desc := fmt.Sprintf("%s in %s. Done in %s", method, endpoint, start_time)

		logService.RecordLog(endpoint, method, status_code, desc, user_id)
	}
}
