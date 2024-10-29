# ConnectDesk - NestJS Backend

NestJS backend project for the ConnectDesk project! 🧨

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/nest-og.png" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

The ConnectDesk project consists on a table of data that centralizes user information in a company. The project uses role-based authorization, where admin users can create and edit data while normal users can just filter and order it.

## Features

- **Authentication**: log in or sign up to a SQLite database.
- **Centralized user data**: get access to the phone number of an user, their email, and place where they work!
- **Built with [Nest](https://github.com/nestjs/nest)**: using Typescrpit and modern OOP techniques.

## Technologies

<div align="center">

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)

</div>

## Endpoints

There are a *lot* of endpoints in this project, so I will just list the most important ones:

**User data**:
| Method | Endpoint | Description |
|--------|:--------:|:-----------:|
|  GET   | api/users | Return user data (you can also filter and order it!)
|  GET   | api/users:id | Return specific user data by its rut (unique identifier)
|  POST  | api/users | Create a new user
|  PATCH | api/users | Update user data 
|  DELETE | api/users:id | Delete an existing user

**Departments handlers**:
| Method | Endpoint | Description |
|--------|:--------:|:-----------:|
|   GET  | api/departments | Return all existing departmens
|   POST | api/departments | Create a new department
|  PATCH | api/departments:id | Update a department
|  DELETE | api/departments:id | Delete an existing department

**Directions handlers**:
| Method | Endpoint | Description |
|--------|:--------:|:-----------:|
|   GET  | api/directions | Return all existing directions
|   POST | api/directions | Create a new direction
|  PATCH | api/directions:id | Update a direction
|  DELETE | api/directions:id | Delete an existing direcion

**Excel handler**:
| Method | Endpoint | Description |
|--------|:--------:|:-----------:|
| GET | api/excel/download | Download an excel file with user data
| GET | api/excel/template | Download an excel template
| POST | api/excel/upload | Upload an excel file with user data and save it to the database!


## Running the app in your machine

```bash
# installing dependencies
$ pnpm install

# generating prisma schema
$ pnpx prisma generate

# run initial prisma migration
$ pnpx prisma migrate dev --name init

# development
$ pnpm run start

# watch mode
$ pnpm run start:dev
```

## Important

Make sure you have the necessary enviroment variables defined:

```bash
DATABASE_URL="file:./dev.db"

PORT=3000
SECRET=custom-jwt-secret
EMAIL_ADDRESS=your-configured-email-address
EMAIL_PASS=configured-email-address-password
```

(The email is if you need to reset your password!)

## Unit testing

```bash
# unit tests
$ pnpm run test

```

---

Thanks for visiting this project!

This was originally made in [Express](https://expressjs.com) with plain JavaScript, but over time I thought I needed to migrate it to Nest to get familiar with the framework and learn about OOP.

<div align="center">

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
    
</div>

<div align="center">
<a href="http://nestjs.com/" target="blank"><img src="https://www.kscerbiakas.lt/content/images/size/w1200/2023/12/66769-2-1.jpg" width=700 alt="Cat image" /></a>
</div>