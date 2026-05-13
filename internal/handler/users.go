package handler

import (
	"log"
	"net/http"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/model"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(s *service.UserService) *UserHandler {
	return &UserHandler{service: s}
}

func (h *UserHandler) RegisterRoutes(r *gin.Engine) {
	users := r.Group("/users")
	users.GET("", h.GetUsers)
	users.GET("/summary", h.GetSummary)
	users.POST("", h.CreateUser)
}

func (h *UserHandler) GetUsers(c *gin.Context) {
	res, err := h.service.GetUsersService()

	if err != nil {
		log.Fatal("Error processing data: ", err)
	}

	response := model.UserModel{
		Message:   "Data sent!",
		Content:   res,
		Showing:   10,
		Page:      1,
		Total:     10,
		TotalData: 23,
	}

	c.JSON(http.StatusOK, response)
}

func (h *UserHandler) GetSummary(c *gin.Context) {
	res, err := h.service.GetUsersSummary()
	if err != nil {
		log.Fatal("Error counting data: ", err)
	}

	c.JSON(http.StatusOK, res)
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var user model.CreateUserModel
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userId := h.service.CreateUser(user)
	if userId == -1 {
		c.JSON(http.StatusConflict, gin.H{
			"response": "Failed to create user: User already exists",
		})

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created!",
	})
}
