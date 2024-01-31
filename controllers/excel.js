const excelRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const excel = require('exceljs')

const getToken = res => {
    const authorization = res.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '') 
    }
    return null
}

// Creación del archivo excel:
excelRouter.get('/api/download/', async (req, res) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)

    if (!decodedToken.rut) {
        return res.status(401).json({ error: 'Token Inválido' })
    }
    
    const { users, page } = req.body

    // Creando el archivo excel:
    const workbook = new excel.Workbook()

    workbook.creator = 'System'
    workbook.lastModifiedBy = 'Backend Server'
    workbook.created = new Date()

    // Creando una página:
    const worksheet = workbook.addWorksheet('Tabla de usuarios')

    // Creando columnas:
    worksheet.columns = [
        { header: 'rut', key: 'rut' },
        { header: 'nombres', key: 'nombres' },
        { header: 'apellidos', key: 'apellidos' },
        { header: 'email', key: 'email' },
        { header: 'rol', key: 'rol' },
        { header: 'dependencias', key: 'dependencias' },
        { header: 'direcciones', key: 'direcciones' },
        { header: 'numMunicipal', key: 'numMunicipal' },
        { header: 'anexo', key: 'anexoMunicipal' }
    ]

    const projection = {
        rut: 1,
        nombres: 1,
        apellidos: 1,
        email: 1,
        rol: 1,
        dependencias: 1,
        direcciones: 1,
        numMunicipal: 1,
        anexoMunicipal: 1,
    }

    if (users === 'todo') {
        const data = await User.find({}, projection).toArray()
        console.log(data)
        data.forEach(row => {
            worksheet.addRow(row)
        })

        await workbook.xlsx.writeFile('output.xlsx')

    } else {
        const pageNumber = parseInt(page)
        const getUsers = parseInt(users)
        const skip = (pageNumber - 1) * getUsers

        const data = await User.find({}, projection).skip(skip).limit(users)
        data.forEach(row => {
            worksheet.addRow(row)
        })

        await workbook.xlsx.writeFile('output.xlsx')
    }
    res.redirect('/api/ExcelDownload/')
})

module.exports = excelRouter