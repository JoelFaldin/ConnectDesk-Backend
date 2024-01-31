const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getToken = res => {
    const authorization = res.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '') 
    }
    return null
}

// Obtener la data para la tabla:
userRouter.get('/api/data/', async (req, res, next) => {
    const { pageSize, page } = req.query
    const pageNumber = parseInt(page)
    const pageSizeNumber = parseInt(pageSize)
    const skip = (pageNumber - 1) * pageSizeNumber

    if (pageSizeNumber === 1 && pageNumber === 10) {
        try {
            const content = await User.find({}).skip(0).limit(10)
            const totalData = await User.countDocuments()
            res.status(200).json({ content, totalData })
        } catch(error) {
            next(error)
        }
    }

    try {
        const content = await User.find({}).skip(skip).limit(pageSizeNumber)
        const totalData = await User.countDocuments()
        res.status(200).json({ content, totalData })
    } catch(error) {
        next(error)
    }
})

// Crear un nuevo usuario:
userRouter.post('/api/newUser', async (req, res, next) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)

    if (!decodedToken.rut) {
        return res.status(401).json({ error: 'Token Inválido' })
    }

    const user = await User.findOne({ rut: decodedToken.rut })

    if (user.rol === 'superAdmin') {
        const checkUser = await User.findOne({ rut: req.body.rut })
        if (!checkUser) {
            const { rut, nombres, apellidos, email, passHash, rol, dependencias, direcciones, numMunicipal, anexoMunicipal } = req.body
            
            const salt = 10
            const hash = await bcrypt.hash(passHash, salt)
            const user = new User({
                rut,
                nombres,
                apellidos,
                email,
                passHash: hash,
                rol,
                dependencias,
                direcciones,
                numMunicipal,
                anexoMunicipal
            })
    
            await user.save()
            console.log('Usuario creado!')
            res.status(201).json({ message: 'Usuario creado!' })
        } else {
            res.status(409).json({ message: 'El usuario ya existe en la base de datos.' })
        }
    } else {
        res.status(401).json({ message: 'Este usuario no puede crear nuevos usuarios!' })
    }
})

// Actualizar un usuario:
userRouter.put('/api/update/', async (req, res, next) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)

    if (!decodedToken.rut) {
        return res.status(401).json({ error: 'Token Inválido' })
    }

    const user = await User.findOne({ rut: decodedToken.rut })
    const { values, pageSize, page } = req.body

    const pageNumber = parseInt(page)
    const pageSizeNumber = parseInt(pageSize)
    const skip = (pageNumber - 1) * pageSizeNumber


    if (user.rol === 'superAdmin' || user.rol === 'admin') {
        try {
            const content = await User.find({}).skip(skip).limit(pageSizeNumber)
            const updateUser = content[values[0].rowIndex]

            const newUser = {}
            values.forEach(({ columnId, value }) => {
                newUser[columnId] = value
            })

            await User.findByIdAndUpdate(updateUser._id, newUser, { new: true, runValidators: true, context: 'query' })
            console.log('Usuario actualizado!')
            res.status(200).json({ message: 'Se actualizó el usuario!' })
        } catch(error) {
            console.log(error)
            next(error)
        }
    }
})

// Eliminar un usuario:
userRouter.delete('/api/delete/:rut', async (req, res, next) => {
    try {
        const user = await User.findOne({rut: req.params.rut})
        await User.findByIdAndDelete(user._id)
        console.log('Usuario eliminado.')
        res.status(204).json({ message: 'Usuario eliminado.' })
    } catch(error) {
        next(error)
    }
})

// Crear un nuevo admin
userRouter.put('/api/newAdmin/:rut', async (req, res, next) => {
    try {
        const user = await User.findOne({ rut: req.params.rut })
        const newUser = await User.findByIdAndUpdate(user._id, { rol: user.rol === 'admin' ? 'user' : 'admin' }, { new: true, runValidators: true, context: 'query' })
        newUser.rol === 'admin'
            ? res.status(200).json({ message: 'Este usuario es ahora un admin!' })
            : res.status(200).json({ message: 'Este usuario ha dejado de ser un admin' })
    } catch(error) {
        next(error)
    }
})

module.exports = userRouter