package handler

import (
	"errors"
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
	auth := r.Group("api/auth")
	auth.POST("/register", h.RegisterUser)
	auth.POST("", h.Login)
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

func (h *AuthHandler) Login(c *gin.Context) {
	var loginData model.LoginData
	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := h.service.Login(loginData)
	if err != nil {
		if errors.Is(err, model.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"response": err.Error(),
			})
		} else if errors.Is(err, model.ErrToken) {
			c.JSON(http.StatusInternalServerError, gin.H{
				"response": err.Error(),
			})
		} else if errors.Is(err, model.ErrIncorrectPassword) {
			c.JSON(http.StatusBadRequest, gin.H{
				"response": err.Error(),
			})
		}

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":      res.Token,
		"message":    res.Message,
		"identifier": res.Identifier,
		"names":      res.Names,
		"email":      res.Email,
		"role":       res.Role,
	})
}
