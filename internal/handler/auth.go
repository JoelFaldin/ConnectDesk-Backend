package handler

import (
	"net/http"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/model"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service *service.AuthService
}

func NewAuthHandler(s *service.AuthService) *AuthHandler {
	return &AuthHandler{service: s}
}

func (h *AuthHandler) RegisterRoutes(r *gin.Engine) {
	auth := r.Group("/auth")
	auth.POST("/register", h.RegisterUser)
}

func (h *AuthHandler) RegisterUser(c *gin.Context) {
	var registerUser model.RegisterUser
	if err := c.ShouldBindJSON(&registerUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"response": err.Error(),
		})

		return
	}

	userId, err := h.service.RegisterUser(registerUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"response": "Couldnt complete the operation.",
		})
	}

	if userId == -1 {
		c.JSON(http.StatusConflict, gin.H{
			"response": "User already exists",
		})

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created!",
	})
}
