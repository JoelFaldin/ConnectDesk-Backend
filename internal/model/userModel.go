package model

import "fmt"

type UserData struct {
	Rut        string `json:"rut"`
	Names      string `json:"names"`
	Lastnames  string `json:"lastnames"`
	Email      string `json:"email"`
	Role       string `json:"role"`
	Departmens string `json:"departments"`
	Directions string `json:"directions"`
	JobNumber  string `json:"jobNumber"`
	Contact    string `json:"Contact"`
}

type UserModel struct {
	Message   string     `json:"message"`
	Content   []UserData `json:"content"`
	Showing   int        `json:"showing"`
	Page      int        `json:"page"`
	Total     int        `json:"total"`
	TotalData int        `json:"totalData"`
}

type CreateUserModel struct {
	Rut       string `json:"rut" binding:"required"`
	Names     string `json:"names" binding:"required"`
	Lastnames string `json:"lastnames" binding:"required"`
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	Role      string `json:"role" binding:"required"`

	Departments string `json:"departments" binding:"required"`
	Directions  string `json:"directions" binding:"required"`
	JobNumber   string `json:"jobNumber" binding:"required"`
	Contact     string `json:"contact" binding:"required"`
}

type CreateNewUser struct {
	Rut       string `json:"rut"`
	Names     string `json:"names"`
	Lastnames string `json:"lastnames"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Role      string `json:"role"`
}

type CreateNewDetails struct {
	Departments string `json:"departments"`
	Directions  string `json:"directions"`
	JobNumber   string `json:"jobNumber"`
	Contact     string `json:"contact"`
}

type UpdateUserInput struct {
	Rut         *string `json:"name"`
	Names       *string `json:"names"`
	Lastnames   *string `json:"lastnames"`
	Email       *string `json:"email"`
	Departments *string `json:"department"`
	Directions  *string `json:"directions"`
	JobNumber   *string `json:"jobNumber"`
	Contact     *string `json:"contact"`
}

type RegisterUser struct {
	Rut         *string `json:"rut" binding:"required"`
	Names       *string `json:"names" binding:"required"`
	Lastnames   *string `json:"lastnames" binding:"required"`
	Email       *string `json:"email" binding:"required"`
	Password    *string `json:"password" binding:"required"`
	Departments *string `json:"departments" binding:"required"`
	Directions  *string `json:"directions" binding:"required"`
	JobNumber   *string `json:"jobNumber" binding:"required"`
	Contact     *string `json:"contact" binding:"required"`
}

type LoginData struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Message    string
	Token      string
	Names      string
	Email      string
	Role       string
	Identifier int
}

var ErrUserNotFound = fmt.Errorf("user not found")
var ErrToken = fmt.Errorf("couldnt complete login, try again later")
var ErrIncorrectPassword = fmt.Errorf("Incorrect password, try again")
