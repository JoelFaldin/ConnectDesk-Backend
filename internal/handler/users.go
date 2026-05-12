package handler

import (
	"net/http"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(s *service.UserService) *UserHandler {
	return &UserHandler{service: s}
}

func (h *UserHandler) GetUsers(c *gin.Context) {
	res := h.service.GetUsersService()
	c.JSON(http.StatusOK, gin.H{
		"data": res,
	})
}
