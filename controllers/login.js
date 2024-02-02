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

    if (user === null) {
        return res.status(404).json({ rut: 'Rut incorrecto, ingrese uno nuevo...' })
    } else if (!goodPassword) {
        return res.status(401).json({ password: 'Contraseña incorrecta.' })
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

// Ruta para recuperar la contraseña (sin usar):
loginRouter.post('/getPassword', async (req, res) => {
    const { rut, email } = req.body

    try {
        const user = await User.findOne({ rut: rut })
    
        if (user && user.email === email) {
            res.status(200).json({ message: 'Credenciales correctas.' })
            return
        }
        res.status(404).json({ error: 'Usuario no encontrado.' })
        return
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' })
        return
    }
})

module.exports = loginRouter