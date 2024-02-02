const moongose = require('mongoose')

const blackListSchema = moongose.Schema({
    token: {
        type: String,
        required: true
    }
})

module.exports = moongose.model('Blacklist', blackListSchema)