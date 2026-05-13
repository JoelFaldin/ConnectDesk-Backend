package repository

import (
	"database/sql"

	"github.com/JoelFaldin/ConnectDesk-backend/internal/model"
)

type DetailsRepository struct {
	db *sql.DB
}

func NewDetailsRepository(db *sql.DB) *DetailsRepository {
	return &DetailsRepository{db: db}
}

func (r *UserRepository) CreateDetails(newDetails model.CreateNewDetails, rut string) int {
	var newDetailId int

	query := `INSERT INTO user_job_details (departments, directions, jobNumber, contact, user_rut) VALUES ($1, $2, $3, $4, $5) RETURNING id`
	r.db.QueryRow(query, newDetails.Departments, newDetails.Directions, newDetails.JobNumber, newDetails.Contact, rut).Scan(&newDetailId)

	return newDetailId
}

func (r *UserRepository) DetailsExists(depto string) int {
	var id int
	r.db.QueryRow("SELECT id FROM user_job_details WHERE departments = $1", depto).Scan(&id)

	return id
}

func (r *UserRepository) GetJobDetails() (*sql.Rows, error) {
	return r.db.Query("SELECT * FROM user_job_details")
}

func (r *UserRepository) DeleteJobDetails(detailsId int) {
	r.db.Exec("DELETE FROM user_job_details WHERE id = $1", detailsId)
}
