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

// Añadir un usuario:
// const asyncFunction = async() => {
//     const salt = 10
//     const hash = await bcrypt.hash('testpass', salt)
    
//     const user = new User({
//         rut: '13.111.118-1',
//         nombres: 'Test',
//         apellidos: 'Test',
//         email: 'testemail@gmail.com',
//         passHash: hash,
//         rol: 'user',
//         dependencias: 'Municipalidad norte',
//         direcciones: 'Iquique',
//         numMunicipal: '56 9 1000 0002',
//         anexoMunicipal: '1002'
//     })
    
//     user.save().then(() => {
//         console.log('Usuario agregado!')
//         mongoose.connection.close()
//     })
// }

// asyncFunction()

// User.find({}).then(res => console.log(res))

const port = config.PORT
app.listen(port, () => {
    console.log('Server iniciado!')
    console.log(`http://localhost:${port}`)
})