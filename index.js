const app = require('./app')
const mongoose = require('mongoose')
const config = require('./utils/config')

mongoose.set('strictQuery', false)

const port = config.PORT
app.listen(port, '0.0.0.0', () => {
    console.log('Server started!!')
    console.log(`http://localhost:${port}`)
}) 