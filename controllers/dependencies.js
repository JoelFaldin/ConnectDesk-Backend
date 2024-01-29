const dependencyRouter = require('express').Router()
const Dependency = require('../models/dependency')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getToken = res => {
    const authorization = res.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '') 
    }
    return null
}

dependencyRouter.get('/api/dependencies', async (req, res, next) => {
    try {
        const request = await Dependency.find({})
        res.status(200).json(request)
    } catch(error) {
        next(error)
    }
})

dependencyRouter.post('/api/newDependency', async (req, res, next) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)

    if (!decodedToken.rut) {
        res.status(401).json({ error: 'Token inválido' })
    }

    const body = req.body
    const user = await User.findOne({ rut: decodedToken.rut })

    const existingDependency = Dependency.findOne({ nombre: body.nombre })
    if (existingDependency) {
        return res.status(409).json({ error: 'Esta dependencia ya existe!' })
    }


    if (user.rol === 'superAdmin') {
        const newDependency = new Dependency({
            nombre: body.nombre,
            direccion: body.direccion
        })

        await newDependency.save()
        console.log('Dependencia creada!')
        res.status(201).json({ message: 'Dependencia creada!' })
    } else {
        res.status(401).json({ error: 'No tienes los permisos necesarios para crear una dependencia.' })
    }
})

module.exports = dependencyRouter