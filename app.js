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
const excelRouter = require('./controllers/excel') // Aquí se craftea el excel
const blackListMiddleware = require('./middleware/blackList')

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
app.use('', loginRouter)

app.use('', blackListMiddleware)

app.use('', userRouter, blackListMiddleware)
app.use('', filterRouter, blackListMiddleware)
app.use('', dependencyRouter, blackListMiddleware)
app.use('', excelRouter, blackListMiddleware)

// Error handlers:
app.use(errorHandler)
app.use(endpointTypo)

module.exports = app