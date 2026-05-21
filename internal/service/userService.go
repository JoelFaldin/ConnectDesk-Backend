package service

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/model"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/repository"
)

type UserService struct {
	userRepo    *repository.UserRepository
	detailsRepo *repository.DetailsRepository
}

func NewUserService(userRepo *repository.UserRepository, detailsRepo *repository.DetailsRepository) *UserService {
	return &UserService{userRepo: userRepo, detailsRepo: detailsRepo}
}

func (s *UserService) GetUsersService() ([]model.UserData, error) {
	res, err := s.userRepo.GetUsers()

	if err != nil {
		return nil, err
	}

	var users []model.UserData
	for res.Next() {
		var u model.UserData

		if err := res.Scan(&u.Departmens, &u.Directions, &u.JobNumber, &u.Contact, &u.Rut, &u.Names, &u.Lastnames, &u.Email, &u.Role); err != nil {
			return nil, err
		}

		users = append(users, u)
	}

	return users, res.Err()
}

func (s *UserService) GetUsersSummary() (*sql.Rows, error) {
	res, err := s.userRepo.GetSummary()
	if err != nil {
		return nil, err
	}

	return res, res.Err()
}

func (s *UserService) CreateUser(newUser model.CreateUserModel) int {
	// s.repo.DeleteJobDetails(1)
	deptoId := s.detailsRepo.DetailsExists(newUser.Departments)
	if deptoId == 0 {
		newDet := model.CreateNewDetails{
			Departments: newUser.Departments,
			Directions:  newUser.Directions,
			JobNumber:   newUser.JobNumber,
			Contact:     newUser.Contact,
		}

		deptoId = s.detailsRepo.CreateDetails(newDet, newUser.Rut)
	}

	userId := s.userRepo.UserExists(newUser.Rut)
	if userId == 0 {
		newUser := model.CreateNewUser{
			Rut:       newUser.Rut,
			Names:     newUser.Names,
			Lastnames: newUser.Lastnames,
			Email:     newUser.Email,
			Password:  newUser.Password,
			Role:      newUser.Role,
		}

		return s.userRepo.CreateUser(newUser, deptoId)
	} else {
		return -1
	}
}

func (h *UserService) UpdateUser(rut string, input model.UpdateUserInput) (sql.Result, error) {
	setClauses := []string{}
	args := []any{}

	if input.Rut != nil {
		setClauses = append(setClauses, "rut = ?")
		args = append(args, *input.Rut)
	}
	if input.Names != nil {
		setClauses = append(setClauses, "names = ?")
		args = append(args, *input.Names)
	}
	if input.Lastnames != nil {
		setClauses = append(setClauses, "lastnames = ?")
		args = append(args, *input.Lastnames)
	}
	if input.Email != nil {
		setClauses = append(setClauses, "email = ?")
		args = append(args, *input.Email)
	}
	if input.Departments != nil {
		setClauses = append(setClauses, "departments = ?")
		args = append(args, *input.Departments)
	}
	if input.Directions != nil {
		setClauses = append(setClauses, "directions = ?")
		args = append(args, *input.Directions)
	}
	if input.JobNumber != nil {
		setClauses = append(setClauses, "jobNumber = ?")
		args = append(args, *input.JobNumber)
	}
	if input.Contact != nil {
		setClauses = append(setClauses, "contact = ?")
		args = append(args, *input.Contact)
	}

	args = append(args, rut)
	query := fmt.Sprintf("UPDATE users SET %s WHERE rut = ?", strings.Join(setClauses, ", "))

	res, err := h.userRepo.RawUpdate(query, args...)
	return res, err
}
