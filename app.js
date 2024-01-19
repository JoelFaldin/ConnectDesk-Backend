const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const userRouter = require('./controllers/users')
const mongoose = require('mongoose')
const {errorHandler, endpointTypo} = require('./middleware/errorHandler')

mongoose.set('strictQuery', false)

// logger.information(`Connecting to: ${config.MONGO_URI}`)

mongoose.connect(config.MONGO_URI)
    .then(() => {
        console.log('Conectado a la base de datos! 🌿 🌳')
    })
    .catch(error => console.error('Error al conectarse a la db.', error))

app.use(cors())
// app.use(express.static('dist'))
app.use(express.json())

app.use('', userRouter)

app.use(errorHandler)
app.use(endpointTypo)

module.exports = app