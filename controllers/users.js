const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

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

// Verificación del login:
userRouter.post('/api/verify', async (req, res, next) => {
    const { rut, password } = req.body
    
    try {
        const user = await User.findOne({ rut: rut })
        if (user) {
            if (bcrypt.compareSync(password, user.passHash)) {
                console.log('Credenciales correctas!!!')
                res.status(200).json(user.rol === 'superAdmin' ? { access: 'superAdmin', user } : user.rol === 'admin' ? { access: 'admin', user } : { access: 'user', user })
            } else if (!bcrypt.compareSync(password, user.passHash)) {
                console.log('Credenciales incorrectas.')
                res.status(401).json({ message: 'La contraseña es incorrecta D:' })
            }
        } else {
            console.log('El usuario no existe en la base de datos.')
            throw new Error('Usuario no encontrado.')
        }   
    } catch(error) {
        next(error)
    }
})

// Crear un nuevo usuario:
userRouter.post('/api/newUser', async (req, res, next) => {
    try {
        // Revisando que el rut ingresado no exista:
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
            throw new Error('El usuario ya existe en la base de datos.')
        }
    } catch(error) {
        next(error)
    }   
})

// Actualizar un usuario:
userRouter.put('/api/update/:rut', async (req, res, next) => {
    try {
        const user = await User.findOne({ rut: req.params.rut })
        const update = await User.findByIdAndUpdate(user._id, { [req.body.column]: req.body.value }, { new: true, runValidators: true, context: 'query' })
        console.log('Usuario actualizado!')
        res.status(200).json({ message: 'Se actualizó el usuario!', update })
    } catch(error) {
        next(error)
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