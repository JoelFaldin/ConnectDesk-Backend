
# ConnectDesk Backend - Go Gin

A [Golang](https://go.dev/) web application build using the [Gin](https://gin-gonic.com/) framework! :D

Includes secure role-based authentication, excel integration, log system. Centralizes user data in an organization.

<p align="center">
  <a href="https://gin-gonic.com/" target="blank"><img src="https://miro.medium.com/1*HtCjHzGwf6iWNqXu5Cndsg.png" alt="Golang Gin Logo" /></a>
</p>

## 🚀 Features

- **Authentication & Authorization**: Login with JWT and registration with role-based access.
- **User management**: Create, read, update and delete user profiles (rut, email, names and last names)!
- **Excel integration**: Import and export data via excel, uploading or downloading a file with data.

## 📦 Technologies

<div align="center">

![Golang](https://img.shields.io/badge/Go-00ADD8?logo=Go&logoColor=white&style=for-the-badge)
![Sqlite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=SQLite&logoColor=white)

</div>

## 📁 Endpoints

All endpoints are prefixed with `/api` and return JSON responses:

**User route**:
| Method | Endpoint | Description |
|--------|:--------:|:-----------:|
|  GET   | /users | Get user data (you can filter and get paginated responses!)
|  GET   | /users/summary | Return the total amount of users in the database
|  POST  | /users | Create a new user
|  PATCH | /users/{rut} | Update user data
|  DELETE | /users/{rut} | Delete an existing user

**Auth route**:
| Method | Endpoint | Description |
|--------|:--------:|:-----------:|
|  POST  | /auth/register | Register an user
|  POST  | /auth | Log in with email and password

**Excel route**:
| Method | Endpoint | Description |
|--------|:--------:|:-----------:|
| GET | /excel/template | Download a template to use
| GET | /excel/download/logs | Download an excel file with all logs in the database
| GET | /excel/download | Download an excel file with user data
| POST | /excel/upload | Upload an excel file with user data and save it to the database!
| GET | /excel/summary | Return the amount of successful and error operations

## 🤖 Configuration

The project is configured to accept request from `http://localhost:4200/`, the local address of the Angular frontend app. You can change this on the `internal/config.cors.go` file.
Additionally, the project also has a log system to save all data related to database operations. It is applied to every route of the backend but these:
```
/api/users
/api/users/summary
/api/logs/summary
/api/logs/all
/api/logs/{code}
/api/excel/summary
/api/health
```

## Environment Variables

To properly run the app, you will need these environment variables:
```
PORT="any_port"
FRONTEND_PORT="any_port"
SECRET_KEY="any_secret_key"
```

## Running the app in your machine

1. Get go dependencies:
```
go mod tidy
```

2. Start the app (the project uses the [air](https://github.com/air-verse/air) go package:
```
air
```

## Thanks for visiting!

This project was originally built in Express and plain JavaScript. Then I refactored it to NestJS to get a better hand at the framework, then it was refactored again using Java Springboot. Now, I decided to refactor it one more time to get comfortable with the Go programming language.
