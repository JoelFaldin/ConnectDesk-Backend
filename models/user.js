const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    rut: String,
    nombres: String,
    apellidos: String,
    email: String,
    passHash: String,
    rol: String || 'user',
    dependencias: String,
    direcciones: String,
    numMunicipal: String,
    anexoMunicipal: String
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