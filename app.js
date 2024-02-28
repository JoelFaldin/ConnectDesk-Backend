const { errorHandler, endpointTypo } = require('./middleware/errorHandler')
const config = require('./utils/config')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()
const cron = require('node-cron')
const BlackList = require('./models/blackList')

const loginRouter = require('./controllers/login')
const blackListMiddleware = require('./middleware/blackList')
const tokenMiddleware = require('./middleware/tokenAuth')
const userRouter = require('./controllers/users')
const filterRouter = require('./controllers/filterData')
const dependencyRouter = require('./controllers/dependencies')
const excelRouter = require('./controllers/excel') // Aquí se craftea el excel!
const directionRouter = require('./controllers/directions')

mongoose.set('strictQuery', false)

// Conexión a la base de datos:
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
app.use('', tokenMiddleware)

app.use('', userRouter, blackListMiddleware)
app.use('', filterRouter, blackListMiddleware)
app.use('', dependencyRouter, blackListMiddleware)
app.use('', excelRouter, blackListMiddleware)
app.use('', directionRouter, blackListMiddleware)

// Error handlers:
app.use(errorHandler)
app.use(endpointTypo)

// Eliminar los tokens de la blacklist cada día a las 14:20am:
cron.schedule('0 20 14 * * * ', async () => {
    try {
        await BlackList.deleteMany({ expiration: { $lt: new Date() } })
    } catch(error) {
        console.log('Hubo un error al eliminar tokens expirados.', error)
    }
} )

module.exports = app