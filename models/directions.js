const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// Modelo de una direacción:
const directionSchema = new mongoose.Schema ({
    direccion: {
        type: String,
        required: true
    }
})

directionSchema.set('toJSON',  {
    transform: (document, returned) => {
        delete returned._id
    }
})

module.exports = mongoose.model('Direction', directionSchema)