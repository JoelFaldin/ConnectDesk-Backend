const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// Department model:
const departmentSchema = mongoose.Schema ({
    name: {
        required: true,
        type: String
    },
})

departmentSchema.set('toJSON', {
    transform: (document, returned) => {
            delete returned._id
    }
})

module.exports = mongoose.model('Department', departmentSchema)