const filterRouter = require('express').Router()
const User = require('../models/user')

// Filtrando datos de la tabla:
filterRouter.get('/api/filter/', async (req, res) => {
    const { column, order, pageSize, page } = req.query
    const pageNumber = parseInt(page)
    const pageSizeNumber = parseInt(pageSize)
    const skip = (pageNumber - 1) * pageSizeNumber

    const filterOrder = order === 'asc' ? 1 : order === 'normal' ? 0 : -1

    try {
        if (filterOrder !== 0) {
            const filteredData = await User.find({}).sort({ [column]: filterOrder }).skip(skip).limit(pageSizeNumber)
            res.status(200).json(filteredData)
        } else  if (filterOrder === 0) {
            const filteredData = await User.find({}).skip(skip).limit(pageSizeNumber)
            res.status(200).json(filteredData)
        } else {
            res.status(400).json({ error: 'Orden inválido.' })
        }
    } catch(error) {
        res.status(404).json({ message: 'Hubo un problema :c', error })
    }
})

filterRouter.get('/api/filter/search', async (req, res) => {
    const { column, value, pageSize, page } = req.query
    const pageNumber = parseInt(page)
    const pageSizeNumber = parseInt(pageSize)
    const skip = (pageNumber - 1) * pageSizeNumber

    try {
        const filteredData = await User.find({ [column]: value }).skip(skip).limit(pageSizeNumber)
        res.status(200).json(filteredData)
    } catch(error) {
        res.status(404).json({ message: 'Hubo un problema :c', error })
    }
})

module.exports = filterRouter