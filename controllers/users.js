const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getToken = req => {
    const authorization = req.headers.authorization
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '') 
    }
    return null
}

// Getting table data (it also handles search values):
userRouter.get('/api/newData/', async (req, res) => {
    const { searchValue, searchColumn, page, pageSize } = req.query
    const pageNumber = parseInt(page == 0 ? 1 : page)
    const pageSizeNumber = parseInt(pageSize)
    const skip = (pageNumber - 1) * pageSizeNumber

    try {
        let query = {}

        if (searchValue) {
            query[searchColumn] = { $regex: new RegExp(searchValue, 'i') }
        }

        let contentQuery = User.find(query).skip(skip).limit(pageSizeNumber)

        const [content, totalData] = await Promise.all([
            contentQuery.exec(),
            User.countDocuments(query),
        ])
        res.status(200).json({ message: 'Data sent!', content, totalData })
    } catch (error) {
        res.status(404).json({ error: 'User not found.' })
    }
})

// Getting user information:
userRouter.get('/api/getUserData', async (req, res) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)

    try {
        const user = await User.findOne({ identifier: decodedToken.identifier })
        const name = user.names.split(' ')[0]

        res.status(200).json({ message: 'User found!', names: name })
    } catch(error) {
        res.status(404).json({ error: 'User not found.' })
    }
})

// Getting data for the filtered table (navigation buttons):
userRouter.get('/api/filterUsers', async (req, res) => {
    const { column, sendOrder, pageSize, page } = req.query

    const pageNumber = parseInt(page);
    const pageSizeNumber = parseInt(pageSize);
    const skip = (pageNumber - 1) * pageSizeNumber;

    try {
        let query = {}

        if (column !== '' && sendOrder !== 0) {
            const sort = {}
            sort[column] = parseInt(sendOrder)

            query = User.find({}).sort(sendOrder === 0 || sendOrder === '0' ? {} : sort).skip(skip).limit(pageSizeNumber)
        } else {
            query = User.find({}).skip(skip).limit(pageSizeNumber)
        }

        const [content, totalData] = await Promise.all([
            query.exec(),
            User.countDocuments(),
        ])

        return res.status(200).json({ message: 'Data filtered!', content, totalData })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Creating a new user:
userRouter.post('/api/newUser', async (req, res) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)
    
    const user = await User.findOne({ identifier: decodedToken.identifier })

    if (user.role === 'superAdmin') {
        const checkUser = await User.findOne({ identifier: req.body.identifier })
        if (!checkUser) {
            const { identifier, names, lastNames, email, passHash, role, departments, directions, jobNumber, contactNumber } = req.body

            try {
                const salt = 10
                const hash = await bcrypt.hash(passHash, salt)
                const user = new User({
                    identifier,
                    names,
                    lastNames,
                    email,
                    passHash: hash,
                    role,
                    departments,
                    directions,
                    jobNumber,
                    contactNumber
                })
    
                await user.save()
                res.status(201).json({ message: 'User created!' })
            } catch (error) {
                res.status(500).json({ error: 'There was an error trying to create the user.' })
            }

            
        } else {
            res.status(409).json({ error: 'The user already exists in the database.' })
        }
    } else {
        res.status(401).json({ error: "You can't create new users!" })
    }
})

// Updating an user:
userRouter.put('/api/update/', async (req, res) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)

    const user = await User.findOne({ identifier: decodedToken.identifier })
    const { values, pageSize, page } = req.body

    const pageNumber = parseInt(page)
    const pageSizeNumber = parseInt(pageSize)
    const skip = (pageNumber - 1) * pageSizeNumber


    if (user.role === 'superAdmin' || user.role === 'admin') {
        try {
            const content = await User.find({}).skip(skip).limit(pageSizeNumber)
            const updateUser = content[values[0].rowIndex]

            const newUser = {}
            values.forEach(({ columnId, value }) => {
                newUser[columnId] = value
            })

            await User.findByIdAndUpdate(updateUser._id, newUser, { new: true, runValidators: true, context: 'query' })
            res.status(200).json({ message: 'User updated!' })
        } catch(error) {
            res.status(404).json({ error: 'User not found' })
        }
    }
})

// Deleting an user:
userRouter.delete('/api/delete/:identifier', async (req, res) => {
    try {
        const user = await User.findOne({ identifier: req.params.identifier })
        await User.findByIdAndDelete(user._id)
        res.status(204).json({ message: 'User removed.' })
    } catch(error) {
        res.status(404).json({ error: 'User not found.' })
    }
})

// Turning an existing user into an admin:
userRouter.put('/api/newAdmin/:identifier', async (req, res) => {
    try {
        const user = await User.findOne({ identifier: req.params.identifier })
        const newUser = await User.findByIdAndUpdate(user._id, { role: user.role === 'admin' ? 'user' : 'admin' }, { new: true, runValidators: true, context: 'query' })
        newUser.role === 'admin'
            ? res.status(200).json({ message: 'This user is now an admin!' })
            : res.status(200).json({ message: 'This user is no longer an administrator.' })
    } catch(error) {
        res.status(401).json({ error: 'No se encontró al usuario!' })
    }
})

module.exports = userRouter