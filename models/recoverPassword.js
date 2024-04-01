const mongoose = require('mongoose')

// Model to save a token with the rut:
const recoverPasswordSchema = mongoose.Schema({
    rut: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('RecoverPassword', recoverPasswordSchema)