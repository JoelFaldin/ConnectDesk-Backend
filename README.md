# ConnectDesk Backend - Spring Boot

Spring Boot backend app for the ConnectDesk project. Includes secure role-based autentication, and centralizes user data in an organization. It includes authentication, user management, and Excel import/export funcionalities.

<p align="center">
  <a href="https://spring.io/projects/spring-boot" target="blank"><img src="https://imgs.search.brave.com/z8133euH64zknm3yfaC0IcEfv6ytTDBhMa3cgp1OLhU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmluY2Vuem9yYWNj/YS5jb20vaW1hZ2Vz/L3NwcmluZy5wbmc" alt="Spring Boot Logo" /></a>
</p>

## 🚀 Features

- **Authentication & Authorization**: Login with JWT and registration with role-based access.
- **User management**: Create, read, update and delete user profiles (rut, email, names and lastnames)!
- **Excel integration**: Import and export data via excel, uploading or downloading a file with data.
- **Modular architecture**: Implementing Spring Data JPA, including controllers, services and repositories.

## 📦 Technologies

<div align="center">

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A.svg?style=for-the-badge&logo=Gradle&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

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

The project is configured to accept request from `http://localhost:4200/`, the local address of the Angular frontend app. You can change this on the `CorsConfig.java` file, in the main package.
Additionally, the project also has a _logger_ configured to save all data related to database operations. It is applied to every route of the backend but these:
```
/api/users
/api/users/summary
/api/logs/summary
/api/logs/all
/api/logs/{code}
/api/excel/summary
/api/health
```

## Running the app in your machine

1. Make sure you added the application.properties file into your project:
```bash
# MySQL Config:
spring.datasource.url=jdbc:mysql://localhost:3306/db-name
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA (Hibernate) config
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

2. Build and run the project:
```bash
./gradlew clean build
./gradlw bootrun
```

3. Run the tests:
```bash
./gradlew test
```
