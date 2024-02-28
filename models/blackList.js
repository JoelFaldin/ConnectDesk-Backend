const moongose = require('mongoose')

// Modelo de la BlackList:
const blackListSchema = moongose.Schema({
    token: {
        type: String,
        required: true
    },
    expiration: {
        type: Date,
        required: true
    }
})

module.exports = moongose.model('Blacklist', blackListSchema)