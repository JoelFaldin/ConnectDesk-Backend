package service

import (
	"github.com/JoelFaldin/ConnectDesk-backend/internal/model"
	"github.com/JoelFaldin/ConnectDesk-backend/internal/repository"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetUsersService() ([]model.UserData, error) {
	res, err := s.repo.GetUsers()

	if err != nil {
		return nil, err
	}

	var users []model.UserData
	for res.Next() {
		var u model.UserData

		if err := res.Scan(&u.Contact, &u.Departmens, &u.Directions, &u.Email, &u.JobNumber, &u.Lastnames, &u.Names, &u.Role, &u.Rut); err != nil {
			return nil, err
		}

		users = append(users, u)
	}

	return users, res.Err()
}
