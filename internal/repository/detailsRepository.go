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

func (r *DetailsRepository) CreateDetails(newDetails model.CreateNewDetails, rut string) int {
	var newDetailId int

	query := `INSERT INTO user_job_details (departments, directions, jobNumber, contact, user_rut) VALUES ($1, $2, $3, $4, $5) RETURNING id`
	err := r.db.QueryRow(query, newDetails.Departments, newDetails.Directions, newDetails.JobNumber, newDetails.Contact, rut).Scan(&newDetailId)
	if err != nil {
		return 0
	}

	return newDetailId
}

func (r *DetailsRepository) DetailsExists(userRut string) int {
	var id int
	r.db.QueryRow("SELECT id FROM user_job_details WHERE user_rut = $1", userRut).Scan(&id)

	return id
}

func (r *DetailsRepository) GetJobDetails() (*sql.Rows, error) {
	return r.db.Query("SELECT * FROM user_job_details")
}

func (r *DetailsRepository) DeleteJobDetails(detailsId int) {
	r.db.Exec("DELETE FROM user_job_details WHERE id = $1", detailsId)
}
