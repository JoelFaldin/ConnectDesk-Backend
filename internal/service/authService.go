package service

import (
	"fmt"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/model"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/repository"
)

type AuthService struct {
	userRepo    *repository.UserRepository
	detailsRepo *repository.DetailsRepository
}

func NewAuthService(userRepo *repository.UserRepository, detailsRepo *repository.DetailsRepository) *AuthService {
	return &AuthService{userRepo: userRepo, detailsRepo: detailsRepo}
}

func (h *AuthService) RegisterUser(newUser model.RegisterUser) int {
	detailsId := h.detailsRepo.DetailsExists(*newUser.Rut)
	if detailsId == 0 {
		fmt.Println("details doesnt exist")
		newDetails := model.CreateNewDetails{
			Departments: *newUser.Departments,
			Directions:  *newUser.Directions,
			JobNumber:   *newUser.JobNumber,
			Contact:     *newUser.Contact,
		}

		detailsId = h.detailsRepo.CreateDetails(newDetails, *newUser.Rut)
	}

	userId := h.userRepo.UserExists(*newUser.Rut)
	if userId == 0 {
		newUser := model.CreateNewUser{
			Rut:       *newUser.Rut,
			Names:     *newUser.Names,
			Lastnames: *newUser.Lastnames,
			Email:     *newUser.Email,
			Password:  *newUser.Password,
			Role:      "user",
		}

		return h.userRepo.CreateUser(newUser, detailsId)
	} else {
		return -1
	}
}
