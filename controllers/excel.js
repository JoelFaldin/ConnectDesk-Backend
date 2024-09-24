const excelRouter = require('express').Router()
const User = require('../models/user')
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
                return res.status(400).json({ message: 'Theres an empty identifier, check that column.' })
            } else if (item.B === undefined) {
                return res.status(400).json({ message: 'Theres an empty name cell. Go check the names column.' })
            } else if (item.C === undefined) {
                return res.status(400).json({ message: 'Theres an empty lastname cell. Check that column.' })
            } else if (item.D === undefined) {
                return res.status(400).json({ message: 'Theres an empty email cell. Please check that column.' })
            } else if (item.E === undefined) {
                return res.status(400).json({ message: 'Theres one or more empty role columns. Check that column before proceeding.' })
            } else if (item.F === undefined) {
                return res.status(400).json({ message: 'Theres a cell with empty dependencies. Check the column NOW.' })
            } else if (item.G === undefined) {
                return res.status(400).json({ message: 'Theres an empty directions cell. Please check that column.' })
            } else if (item.I === undefined) {
                return res.status(400).json({ message: 'Theres one or more empty contact numbers. Go check that.' })
            }

            if (item.E !== 'user') {
                return res.status(400).json({ message: 'An user can only have "user" as a role!' })
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

        const idealHeaders = ['Identifier', 'Names', 'Lastnames', 'Email', 'Role', 'Departments', 'Directions', 'Job Number', 'Contact Number']

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
            'Identifier': 'identifier',
            'Names': 'names',
            'Lastnames': 'lastnames',
            'Email': 'email',
            'Role': 'role',
            'departments': 'departments',
            'Directions': 'directions',
            'Job Number': 'jobNumber',
            'Contact Number': 'contactNumber'
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
                identifier: newArray[i].identifier,
                names: newArray[i].names,
                lastNames: newArray[i].lastnames,
                email: newArray[i].email,
                passHash: null,
                role: newArray[i].role,
                departments: newArray[i].Departments,
                directions: newArray[i].directions,
                jobNumber: newArray[i].jobNumber,
                contactNumber: newArray[i].contactNumber
            })
            
            await newUser.save()
        }

        return res.status(201).json({ message: 'Users added to the database!' })
    } catch(error) {
        return res.status(500).json({ error: 'Internal server error.' })
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
    const worksheet = workbook.addWorksheet('User table')

    // Creating columns:
    worksheet.columns = [
        { header: 'Identifier', key: 'identifier' },
        { header: 'Names', key: 'names' },
        { header: 'Lastnames', key: 'lastNames' },
        { header: 'Email', key: 'email' },
        { header: 'Role', key: 'role' },
        { header: 'Department', key: 'departments' },
        { header: 'Directions', key: 'directions' },
        { header: 'Job Number', key: 'jobNumber' },
        { header: 'Contact Mumber', key: 'contactNumber' }
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
        if (header === 'Email') {
            col.width = maxLength + 20
        }
    })

    const projection = {
        identifier: 1,
        names: 1,
        lastNames: 1,
        email: 1,
        role: 1,
        departments: 1,
        directions: 1,
        jobNumber: 1,
        contactNumber: 1,
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

    return res.end(buffer, 'binary')
})

// Creating a template file:
excelRouter.get('/api/template', async (req, res) => {
    // New excel file:
    const workbook = new ExcelJS.Workbook()

    workbook.creator = 'System'
    workbook.lastModifiedBy = 'Backend System'
    workbook.created = new Date()

    // Adding a page:
    const worksheet = workbook.addWorksheet('Template')

    // Adding column:
    worksheet.columns = [
        { header: 'Identifier', key: 'identifier', width: 20 },
        { header: 'Names', key: 'names', width: 20 },
        { header: 'Lastnames', key: 'lastnames', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Role', key: 'role', width: 15 },
        { header: 'Departments', key: 'department', width: 20 },
        { header: 'Directions', key: 'directions', width: 20 },
        { header: 'Job Number', key: 'jobNumber', width: 20 },
        { header: 'Contact Number', key: 'contactNumber', width: 20 }
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

    return res.end(buffer, 'binary')
})

module.exports = excelRouter