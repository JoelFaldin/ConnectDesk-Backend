package service

import (
	"database/sql"
	"fmt"

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
	deptoId := s.userRepo.DetailsExists(newUser.Departments)
	if deptoId == 0 {
		newDet := model.CreateNewDetails{
			Departments: newUser.Departments,
			Directions:  newUser.Directions,
			JobNumber:   newUser.JobNumber,
			Contact:     newUser.Contact,
		}

		deptoId = s.userRepo.CreateDetails(newDet, newUser.Rut)
	}

	userId := s.userRepo.UserExists(newUser.Rut)
	fmt.Println(userId)
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

	// for r.Next() {
	// 	var id int
	// 	var departments, directions, jobNumber, contact, user_rut string
	// 	if err := r.Scan(&id, &departments, &directions, &jobNumber, &contact, &user_rut); err != nil {
	// 		log.Println(err)
	// 		continue
	// 	}
	// 	// Print to console or log
	// 	fmt.Printf("ID: %d: %s - %s - %s - %s - %s\n", id, departments, directions, jobNumber, contact, user_rut)
	// }

	// fmt.Println(res)
}
