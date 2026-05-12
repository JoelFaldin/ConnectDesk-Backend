package service

import (
	"database/sql"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/repository"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetUsersService() *sql.Rows {
	res, err := s.repo.GetUsers()

	if err != nil {

	}

	return res
}
