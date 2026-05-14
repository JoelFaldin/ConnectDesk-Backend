package model

import "fmt"

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
