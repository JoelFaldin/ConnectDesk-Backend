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
	users := r.Group("api/users")
	users.GET("", h.GetUsers)
	users.GET("/summary", h.GetSummary)
	users.POST("", h.CreateUser)
	users.PATCH("/:rut", h.UpdateUser)
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

func (h *UserHandler) UpdateUser(c *gin.Context) {
	userRut := c.Param("rut")

	var input model.UpdateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"response": "Missing column or value in update request.",
		})

		return
	}

	if input.Rut == nil && input.Names == nil && input.Lastnames == nil && input.Email == nil && input.Departments == nil && input.Directions == nil && input.JobNumber == nil && input.Contact == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"response": "At least one field must be provided",
		})

		return
	}

	_, err := h.service.UpdateUser(userRut, input)
	if err != nil {
		log.Fatal("Couldnt update user: ", err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User updated!",
	})
}
