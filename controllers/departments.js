const departmentRouter = require('express').Router()
const Department = require('../models/departments')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getToken = res => {
    const authorization = res.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '') 
    }
    return null
}

// Getting departments:
departmentRouter.get('/api/getDepartments', async (req, res) => {
    try {
        const request = await Department.find({})
        res.status(200).json({ message: 'Departments sent!', request })
    } catch(error) {
        res.status(404).json({ error: 'No departments found.' })
    }
})

// Creating a new department:
departmentRouter.post('/api/newDepartment', async (req, res) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)

    const body = req.body
    const user = await User.findOne({ identifier: decodedToken.identifier })

    const existingDepartment = await Department.findOne({ name: body.name })

    if (existingDepartment) {
        return res.status(409).json({ error: 'This department already exists!' })
    }

    if (user.role === 'superAdmin') {
        const newDepartment = new Department({
            name: body.name
        })

        await newDepartment.save()
        res.status(201).json({ message: 'Department created!' })
    } else {
        res.status(401).json({ error: 'You cant create a department.' })
    }
})

// Removing a department:
departmentRouter.delete('/api/deleteDepartment/:index', async (req, res) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)
    
    const user = await User.findOne({ identifier: decodedToken.identifier })

    if (user.role === 'superAdmin') {
        try {
            const allDependencies = await Department.find({})
            const deleteDep = allDependencies[req.params.index]

            await Department.findByIdAndDelete(deleteDep._id)
            res.status(204).json({ message: 'Department removed.' })
        } catch(error) {
            res.status(404).json({ error: 'Department not found.' })
        }   
    } else {
        res.status(401).json({ error: 'You cant remove a department.' })
    }
})

// Updating a department:
departmentRouter.put('/api/updateDepartment/:index', async (req, res) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)
    
    const user = await User.findOne({ identifier: decodedToken.identifier })

    if (user.role === 'superAdmin') {
        const body = req.body

        try {
            const allDependencies = await Department.find({})
            const updateDep = allDependencies[req.params.index]
            
            if (body.newName === null) {
                res.status(404).json({ error: 'No value provided!' })
            } else {
                await Department.findByIdAndUpdate(updateDep._id, { name: body.newName })
            }

            res.status(200).json({ message: 'Department updated!' })
        } catch(error) {
            res.status(404).json({ error: 'There was an error trying to update the department.' })
        }
    } else {
        res.status(401).json({ error: 'You cant update a department.' })
    }
})

module.exports = departmentRouter