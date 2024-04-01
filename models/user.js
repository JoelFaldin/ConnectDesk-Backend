const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const bcrypt = require('bcrypt')

// User model:
const userSchema = mongoose.Schema({
    identifier: {
        type: String,
        required: true
    },
    names: {
        type: String,
        required: true
    },
    lastNames: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passHash: {
        type: String,
    },
    role: {
        type: String,
        default: 'user'
    },
    departments: {
        type: String,
        required: true
    },
    directions: {
        type: String,
        required: true
    },
    jobNumber: {
        type: String,
        required: false
    },
    contactNumber: {
        type: String,
        required: true
    },
})

userSchema.methods.verifyPass = (password) => {
    return bcrypt.compare(password, this.passHash)
}

userSchema.set('toJSON', {
    transform: (document, returned) => {
        delete returned._id
        delete returned.__v
        delete returned.passHash
    }
})

module.exports = mongoose.model('User', userSchema)