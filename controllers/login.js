const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const blackList = require('../models/blackList')

// Verificación del login:
loginRouter.post('/api/verifyLogin/', async (req, res) => {
    const { rut, password } = req.body
    
    const user = await User.findOne({ rut })
    const goodPassword = user === null
        ? false
        : await bcrypt.compare(password, user.passHash)

    if (!(user && goodPassword)) {
        return res.status(401).json({ error: 'Rut o contraseña incorrectos!' })
    }

    const userToken = {
        nombres: user.nombres,
        rut: user.rut
    }

    const token = jwt.sign(userToken, process.env.SECRET)

    res.status(200).send({ message: 'Verificación exitosa!', token, nombres: user.nombres, rut: user.rut, access: user.rol })
})

// Proceso de logout:
loginRouter.post('/api/logout', async (req, res) => {
    const token = req.get('authorization')?.replace('Bearer ', '')

    if (token) {
        try {
            await blackList.create({ token })
            return res.status(200).json({ message: 'Sesión cerrada con éxito!' })
        } catch(error) {
            return res.status(500).json({ error: 'Hubo un error al cerrar sesión.' })
        }
    }

    return res.status(401).json({ error: 'Token inexistente' })
})

module.exports = loginRouter