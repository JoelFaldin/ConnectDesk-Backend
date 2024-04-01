const excelRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const ExcelJS = require('exceljs')

const multer = require('multer')
const xlsx = require('xlsx')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Reading data from an excel file and uploading it to the database:
excelRouter.post('/api/uploadExcel', upload.single('excelFile'), async (req, res) => {
    try {
        const excelBuffer = req.file.buffer

        // Creating the excel file:
        const workbook = xlsx.read(excelBuffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        const excelObject = xlsx.utils.sheet_to_json(sheet, { header: 'A' })

        for (let k = 1; k < excelObject.length; k++) {
            const excelCompleteData = excelObject
            const item = excelCompleteData[k]
            
            if (item.A === undefined) {
                res.status(400).json({ message: 'Theres an empty identifier, check that column.' })
                return
            } else if (item.B === undefined) {
                res.status(400).json({ message: 'Theres an empty name cell. Go check the names column.' })
                return
            } else if (item.C === undefined) {
                res.status(400).json({ message: 'Theres an empty lastname cell. Check that column.' })
                return
            } else if (item.D === undefined) {
                res.status(400).json({ message: 'Theres an empty email cell. Please check that column.' })
                return
            } else if (item.E === undefined) {
                res.status(400).json({ message: 'Theres one or more empty role columns. Check that column before proceeding.' })
                return
            } else if (item.F === undefined) {
                res.status(400).json({ message: 'Theres a cell with empty dependencies. Check the column NOW.' })
                return
            } else if (item.G === undefined) {
                res.status(400).json({ message: 'Theres an empty directions cell. Please check that column.' })
                return
            } else if (item.I === undefined) {
                res.status(400).json({ message: 'Theres one or more empty contact numbers. Go check that.' })
                return
            }

            if (item.E !== 'user') {
                res.status(400).json({ message: 'An user can only have "user" as a role!' })
                return
            }
        }
        
        const fixedValues = excelObject.map(item => {
            if (!item.H) {
                const newItem = {
                    A: item.A,
                    B: item.B,
                    C: item.C,
                    D: item.D,
                    E: item.E === undefined ? 'user' : item.E,
                    F: item.F,
                    G: item.G,
                    H: '',
                    I: item.I
                }
                return newItem
            } else {
                return item
            }
        })

        const excelValues = fixedValues.shift()

        const idealHeaders = ['Identifier', 'Names', 'Lastnames', 'Email', 'Role', 'Dependencies', 'Directions', 'Job Number', 'Contact Number']

        // Checking if theres any typo in the excel headers:
        const trueHeaders = Object.values(excelValues)
        const typos = trueHeaders.filter(header => !idealHeaders.includes(header))

        if (typos.length > 0) {
            return res.status(400).json({ message: `One of the headers has an error! "${typos}"` })
        }

        // Checking if theres an extra column or if its lacking one:
        const extra = idealHeaders.filter(header => !idealHeaders.includes(header))
        if (extra.length > 0) {
            return res.status(400).json({ message: 'Theres an extra column. Make sure only the indicated headers exist.' })
        }

        const less = idealHeaders.filter(header => !trueHeaders.includes(header))
        if (less.length > 0) {
            return res.status(400).json({ message: 'Theres one less column. Make sure all of the indicated columns exist!' })
        }

        let excelArray = []
        for (let i = 0; i < fixedValues.length; i++) {
            excelArray.push(Object.values(fixedValues[i]))
        }

        let headers = Object.values(excelValues)

        const finalArray = excelArray.map(row => {
            const obj = {}
            headers.forEach((header, index) => {
                obj[header] = row[index]
            })
            return obj
        })

        // Object to turn the keys in the excel file in field names of mongodb:
        const fieldNamesMongo = {
            'Identifier': 'rut',
            'Names': 'nombres',
            'Lastnames': 'apellidos',
            'Email': 'email',
            'Role': 'rol',
            'Dependencies': 'dependencias',
            'Directions': 'direcciones',
            'Job Number': 'numMunicipal',
            'Contact Number': 'anexoMunicipal'
        }

        const newArray = finalArray.map(original => {
            const modifiedObj = {}
            for (const key in original) {
                const modifiedKey = fieldNamesMongo[key] || key
                modifiedObj[modifiedKey] = original[key]
            }
            return modifiedObj
        })

        for (let i = 0; i < newArray.length; i++) {
            const newUser = new User({
                rut: newArray[i].rut,
                nombres: newArray[i].nombres,
                apellidos: newArray[i].apellidos,
                email: newArray[i].email,
                passHash: null,
                rol: newArray[i].rol,
                dependencias: newArray[i].dependencias,
                direcciones: newArray[i].direcciones,
                numMunicipal: newArray[i].numMunicipal,
                anexoMunicipal: newArray[i].anexoMunicipal
            })
            
            await newUser.save()
        }

        res.status(201).json({ message: 'Users added to the database!' })
    } catch(error) {
        res.status(500).json({ error: 'Internal server error.' })
    }
})

// Creating an excel file to download:
excelRouter.get('/api/download/', async (req, res) => {    
    const { users, page } = req.query

    // Creating the file:
    const workbook = new ExcelJS.Workbook()

    workbook.creator = 'System'
    workbook.lastModifiedBy = 'Backend Server'
    workbook.created = new Date()

    // Creating a sheet:
    const worksheet = workbook.addWorksheet('Tabla de usuarios')

    // Creating columns:
    worksheet.columns = [
        { header: 'Identifier', key: 'rut' },
        { header: 'Names', key: 'nombres' },
        { header: 'Lastnames', key: 'apellidos' },
        { header: 'Email', key: 'email' },
        { header: 'Role', key: 'rol' },
        { header: 'Dependencies', key: 'dependencias' },
        { header: 'Directions', key: 'direcciones' },
        { header: 'Job Number', key: 'numMunicipal' },
        { header: 'Contact Mumber', key: 'anexoMunicipal' }
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
        const data = await User.find({}, projection)
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

    const buffer = await workbook.xlsx.writeBuffer()

    res.header('Content-Type', 'application/octet-stream')
    res.header("Content-Disposition", "attachment; filename=userdata.xlsx")

    res.end(buffer, 'binary')
})

// Creating a template file:
excelRouter.get('/api/template', async (req, res) => {
    // New excel file:
    const workbook = new ExcelJS.Workbook()

    workbook.creator = 'System'
    workbook.lastModifiedBy = 'Backend System'
    workbook.created = new Date()

    // Adding a page:
    const worksheet = workbook.addWorksheet('Plantilla')

    // Adding column:
    worksheet.columns = [
        { header: 'Identifier', key: 'rut', width: 20 },
        { header: 'Names', key: 'nombres', width: 20 },
        { header: 'Lastnames', key: 'apellidos', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Role', key: 'rol', width: 15 },
        { header: 'Dependencies', key: 'dependencias', width: 20 },
        { header: 'Directions', key: 'direcciones', width: 20 },
        { header: 'Job Number', key: 'numMunicipal', width: 20 },
        { header: 'Contact Number', key: 'anexoMunicipal', width: 20 }
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

    const buffer = await workbook.xlsx.writeBuffer()

    res.header('Content-Type', 'application/octet-stream')
    res.header("Content-Disposition", "attachment; filename=template.xlsx")

    res.end(buffer, 'binary')
})

module.exports = excelRouter