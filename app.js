const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const {errorHandler, endpointTypo} = require('./middleware/errorHandler')

const userRouter = require('./controllers/users')
const filterRouter = require('./controllers/filterData')
const loginRouter = require('./controllers/login')
const dependencyRouter = require('./controllers/dependencies')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGO_URI)
    .then(() => {
        console.log('Conectado a la base de datos! 🌿 🌳')
    })
    .catch(error => console.error('Error al conectarse a la db.', error))

app.use(cors())
// app.use(express.static('dist'))
app.use(express.json())

// Routers:
app.use('', userRouter)
app.use('', filterRouter)
app.use('', loginRouter)
app.use('', dependencyRouter)

// Error handlers:
app.use(errorHandler)
app.use(endpointTypo)

module.exports = app