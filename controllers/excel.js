const excelRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const ExcelJS = require('exceljs')

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
    
    const { users, page } = req.query

    // Creando el archivo excel:
    const workbook = new ExcelJS.Workbook()

    workbook.creator = 'System'
    workbook.lastModifiedBy = 'Backend Server'
    workbook.created = new Date()

    // Creando una página:
    const worksheet = workbook.addWorksheet('Tabla de usuarios')

    // Creando columnas:
    worksheet.columns = [
        { header: 'Rut', key: 'rut' },
        { header: 'Nombres', key: 'nombres' },
        { header: 'Apellidos', key: 'apellidos' },
        { header: 'Correo electrónico', key: 'email' },
        { header: 'Rol', key: 'rol' },
        { header: 'Dependencias', key: 'dependencias' },
        { header: 'Direcciones', key: 'direcciones' },
        { header: 'Número Municipal', key: 'numMunicipal' },
        { header: 'Anexo', key: 'anexoMunicipal' }
    ]

    const headers = worksheet.getRow(1)
    headers.eachCell(cell => {
        cell.style.font = { bold: true }
        cell.style.border = {
            top: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' }
        }
        cell.style.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'e0e0e0'
            }
        }
    })

    worksheet.columns.forEach((col, index) => {
        let maxLength = 0
        col.eachCell({}, cell => {
            maxLength = Math.max(maxLength, String(cell.value.length))
        })
        col.width = maxLength + 10

        const header = worksheet.getRow(1).getCell(index + 1).value
        if (header === 'email') {
            col.width = maxLength + 20
        }
    })

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
    } else {
        const pageNumber = parseInt(page)
        const getUsers = parseInt(users)
        const skip = (pageNumber - 1) * getUsers

        const data = await User.find({}, projection).skip(skip).limit(users)
        data.forEach(row => {
            worksheet.addRow(row)
        })
    }

    worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.style.border = {
            top: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            }
        })
    })

    const buffer = await workbook.xlsx.writeBuffer();

    res.header('Content-Type', 'application/octet-stream')
    res.header("Content-Disposition", "attachment; filename=userdata.xlsx")

    res.end(buffer, 'binary')
    console.log('Excel creado!')
})

module.exports = excelRouter