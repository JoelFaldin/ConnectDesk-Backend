const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

// Verificación del login:
loginRouter.post('/api/verifyLogin/', async (req, res, next) => {
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

    res.status(200).send({ token, nombres: user.nombres, rut: user.rut, access: user.rol })
})

module.exports = loginRouter