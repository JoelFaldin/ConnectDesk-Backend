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
