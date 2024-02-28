const directionRouter = require('express').Router()
const Direction = require('../models/directions')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getToken = res => {
    const authorization = res.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '') 
    }
    return null
}

// Obteniendo las direcciones:
directionRouter.get('/api/getDirections', async (req, res) => {
    try {
        const directions = await Direction.find({})
        res.status(200).json({ message: 'Direcciones encontradas', directions })
    } catch(error) {
        res.status(404).json({ error: 'No hay direcciones guardadas.' })
    }
})

// Creando una nueva dirección:
directionRouter.post('/api/newDirection', async (req, res) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)
    
    const body = req.body
    const user = await User.findOne({ rut: decodedToken.rut })

    const existsDirection = await Direction.findOne({ direction: body.direction })

    if (existsDirection) {
        return res.status(409).json({ error: 'La dirección ingresada ya existe en la base de datos.' })
    }

    if (user.rol === 'superAdmin') {
        const newDirection = new Direction({
            direccion: body.newDirection
        })
        await newDirection.save()
        res.status(201).json({ message: 'Dirección creada!' })
    } else {
        res.status(401).json({ error: 'No tienes los permisos para crear direcciones.' })
    }
})

// Eliminando una dirección:
directionRouter.delete('/api/deleteDirection', async (req, res) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)

    const user = await User.findOne({ rut: decodedToken.rut })

    if (user.rol === 'superAdmin') {
        try {
            const allDirections = await Direction.find({})
            const deleteDir = allDirections[req.params.index]

            await Direction.findByIdAndDelete(deleteDir._id)
            res.status(204).json({ message: 'Dirección eliminada.' })
        } catch(error) {
            res.status(404).json({ error: 'Dirección no encontrada.' })
        }
    } else {
        res.status(401).json({ error: 'No tienes los permisos para eliminar una dirección.' })
    }
})

// Actualizando una dirección:
directionRouter.put('/api/updateDirection', async (req, res) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)
    
    const user = await User.findOne({ rut: decodedToken.rut })

    if (user.rol === 'superAdmin') {
        const body = req.body

        try {
            const allDirections = await Direction.find({})
            const updateDir = allDirections[req.params.index]

            if (body.direction !== null) {
                await Direction.findByIdAndUpdate(updateDir._id, { direccion: body.direccion })
                res.status(200).json({ message: 'Dirección actualizada!' })
            } else {
                res.status(400).json({ error: 'No puedes ingresar una dirección vacía!' })
            }
        } catch(error) {
            res.status(404).json({ error: 'Hubo un error al actualizar la dependencia D:' })
        }
    } else {
        res.status(401).json({ error: 'No tienes los permisos para actualizar direcciones.' })
    }
})

module.exports = directionRouter