package repository

import "database/sql"

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetUsers() (*sql.Rows, error) {
	return r.db.Query("SELECT * FROM users")
}

func (r *UserRepository) GetSummary() (*sql.Rows, error) {
	return r.db.Query("SELECT COUNT(*) FROM users")
}
