package repository

import (
	"database/sql"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/model"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetUsers() (*sql.Rows, error) {
	return r.db.Query(`SELECT
		user_job_details.departments, user_job_details.directions, user_job_details.jobNumber, user_job_details.contact, users.rut, users.names, users.lastnames, users.email, users.role
		FROM user_job_details
		INNER JOIN users ON user_job_details.user_rut = users.rut
	`)
}

func (r *UserRepository) GetSummary() (*sql.Rows, error) {
	return r.db.Query("SELECT COUNT(*) FROM users")
}

func (r *UserRepository) CreateUser(newUser model.CreateNewUser, detailsId int) int {
	var newUserId int

	userQuery := `INSERT INTO users (rut, names, lastnames, email, password, role, details) VALUES ($1, $2, $3, $4, $5, $6, $7)`
	r.db.QueryRow(userQuery, newUser.Rut, newUser.Names, newUser.Lastnames, newUser.Email, newUser.Password, newUser.Role, detailsId).Scan(&newUserId)

	return newUserId
}

func (r *UserRepository) UserExists(rut string) int {
	var id int
	r.db.QueryRow("SELECT user_id FROM users WHERE rut = $1", rut).Scan(&id)

	return id
}

func (r *UserRepository) DeleteUser(rut string) {
	r.db.Exec("DELETE FROM users WHERE rut = $1", rut)
}
