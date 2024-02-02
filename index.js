const express = require('express')
const app = require('./app')
const cors = require('cors')
const User = require('./models/user')
const mongoose = require('mongoose')
const config = require('./utils/config')

const bcrypt = require('bcrypt')

app.use(express.json)
app.use(cors())

mongoose.set('strictQuery', false)

const port = config.PORT
app.listen(port, () => {
    console.log('Server iniciado!')
    console.log(`http://localhost:${port}`)
})