const filterRouter = require('express').Router()
const User = require('../models/user')

// Filtrando datos de la tabla:
filterRouter.get('/api/filter/', async (req, res) => {
    const { column, order } = req.query
    // const filterOrder = order === 'asc' ? 1 : order === '' ? '' : -1
    if (order === 'asc') {
        const filteredData = await User.find({}).sort({ [column]: 1 })
        res.status(200).json(filteredData)
    } else if (order === 'normal') {
        const filteredData = await User.find({})
        res.status(200).json(filteredData)
    } else {
        const filteredData = await User.find({}).sort({ [column]: -1 })
        res.status(200).json(filteredData)
    }
    res.status(404).json({ message: 'No se encontró al usuario' })
})

module.exports = filterRouter