# React user administration - Backend App built with JavaScript and Express

This repo contains a backend application built with **Express** and **MongoDB** with the purpose of handling API requests and interacting with the database.

## Features

- **ExpressJS**: minimal and flexible Node.js application.
- **MongoDB**: NoSQL database for storage.
- RESTful API with CRUD operations.
- Basic error handling, data validation and middleware implementation.
- Custom enviroment configuration using **dotenv**.

## Starting the app

Before running the app, make sure you have NodeJS installed and a MongoDB server running.
- [NodeJS](https://nodejs.org/en)
- [MongoDB](https://www.mongodb.com/try/download/community) (You could also use MongoDB Atlas!

### Installation

1. Clone the repo:

```
  git clone https://github.com/JoelFaldin/React-User-Administration-Backend.git
```

2. Install dependencies:

```
  npm install
```

3. Create a `.env` file in the root of the project and add the following variables:

```
  PORT = your_port_here_(I recommend using 3001)
  MONGO_URL = mongo_uri

  SECRET = jwt_secret_auth

  EMAIL_ADDRESS = email_that_sends_recover_password_indications
  EMAIL_PASS = email_password
```

4. Run the MongoDB server or use [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)

5. Start the app:

```
  npm run dev
```

### API Endpoints

| Method | Endpoint | Description |
|--------|:--------:|:-----------:|
|   GET  | /api/newData | Get table data |
|   GET  | /api/getUserData | Get user information |
|   GET  | /api/filterUsers | Getting filtered data |
|  POST  | /api/newUser | Create a new user |
|   PUT  | /api/update | Update user data |
| DELETE | /api/delete/:id | Delete an user |
|   PUT  | /api/newAdmin/:id | Turning an user into admin |
|  POST  | /api/verifyLogin | Login verification |
|  POST  | /api/getPassword | Recover password |
|  POST  | /api/verifyToken | Check NewPassword token |
|  PATCH | /api/restorePassword | Update the password |
|  POST  | /api/logout | Processing the logout |
|   GET  | /api/filter | Filter table data |
|   GET  | /api/filter/search | Searching for matching data |
|  POST  | /api/uploadExcel | Reading data from and excel and saving it into a database |
|   GET  | /api/download | Creating an excel file to download |
|   GET  | /api/template | Download an empty excel template |
|   GET  | /api/getDirections | Get directions data |
|  POST  | /api/newDirection | Create a new direction |
| DELETE | /api/deleteDirection/:index | Remove a direction |
|   PUT  | /api/updateDirection/:index | Update a direction |
|   GET  | /api/getDirections | Get directions data |
|  POST  | /api/newDirection | Create a new direction |
| DELETE | /api/deleteDirection | Remove a direction |
|   PUT  | /api/updateDirection/:index | Update a direction |

### Technologies used

<center>

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

</center>
