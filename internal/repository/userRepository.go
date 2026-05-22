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

func (r *UserRepository) RawUpdate(q string, args ...any) (sql.Result, error) {
	return r.db.Exec(q, args...)
}

func (r *UserRepository) UserExistsEmail(email string) *sql.Row {
	return r.db.QueryRow("SELECT user_id, names, role, password FROM users WHERE email = ?", email)
}

func (r *UserRepository) SaveBatch(rows [][]string) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	// Rollback if something goes wrong :0
	defer tx.Rollback()

	stmtDetail, err := tx.Prepare(`
		INSERT INTO user_job_details
		(departments, directions, jobNumber, contact, user_rut)
		VALUES
		(?, ?, ?, ?, ?)
	`)
	if err != nil {
		return err
	}
	defer stmtDetail.Close()

	stmtUser, err := tx.Prepare(`
		INSERT INTO users
		(rut, names, lastnames, email, password, role, details)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		return err
	}
	defer stmtUser.Close()

	for _, row := range rows {
		detailsResult, err := stmtDetail.Exec(row[5], row[6], row[7], row[8], row[0])
		if err != nil {
			return err
		}
		detailsID, err := detailsResult.LastInsertId()
		if err != nil {
			return err
		}

		_, err = stmtUser.Exec(row[0], row[1], row[2], row[3], "", row[4], detailsID)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}
