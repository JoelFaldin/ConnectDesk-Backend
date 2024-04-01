const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// Direction model:
const directionSchema = new mongoose.Schema ({
    direccion: {
        type: String,
        required: true
    },
    address: {
        required: true,
        type: String
    },
})

directionSchema.set('toJSON',  {
    transform: (document, returned) => {
        delete returned._id
    }
})

module.exports = mongoose.model('Direction', directionSchema)