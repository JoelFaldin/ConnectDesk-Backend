const express = require('express')
const app = require('./app')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const User = require('./models/user')
const bcrypt = require('bcrypt')

app.use(express.json)
app.use(cors())

mongoose.set('strictQuery', false)

const port = config.PORT
app.listen(port, '0.0.0.0', () => {
    console.log('Server started!!')
    console.log(`http://localhost:${port}`)
}) 