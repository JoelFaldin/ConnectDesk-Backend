const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const blackList = require('../models/blackList')
const recoverPassword = require('../models/recoverPassword')
const newEmail = require('../utils/email')

// Login verification:
loginRouter.post('/api/verifyLogin/', async (req, res) => {
    const { identifier, password } = req.body
    
    const user = await User.findOne({ identifier })
    const goodPassword = user === null
        ? false
        : await bcrypt.compare(password, user.passHash)

    if (user === null) {
        return res.status(404).json({ identifier: 'Wrong identifier, try another one...' })
    } else if (!goodPassword) {
        return res.status(401).json({ password: 'Wrong password.' })
    }

    const userToken = {
        names: user.names,
        identifier: user.identifier
    }

    const token = jwt.sign(userToken, process.env.SECRET)

    return res.status(200).send({ message: 'Successful verification!', token, nombres: user.names, identifier: user.identifier, access: user.role })
})

// Route to recover the password:
loginRouter.post('/api/getPassword', async (req, res) => {
    const { identifier, email } = req.body
    
    try {
        const user = await User.findOne({ identifier: identifier })
    
        if (user && user.email === email) {
            const expiration = '5m'
            const token = jwt.sign({ identifier }, process.env.SECRET, { expiresIn: expiration })

            recoverPassword.create({ identifier, token })
            const link = `${req.protocol}://192.168.61.250:5173/newPassword?token=${token}`
            const subject = 'Password change'
            const text = `Click here to change the password: ${link}`
            
            newEmail(user.email, subject, text)

            return res.status(200).json({ message: 'Message sent. Go check your email!' })
            return
        } else if (!user) {
            return res.status(404).json({ error: 'User not found.' })
        } else if (user.email !== email) {
            return res.status(401).json({ error: 'Wrong email!' })
        }
        return
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error.', error })
        return
    }
})

// Checking the NewPassword token:
loginRouter.post('/api/verifyToken', async (req, res) => {
    const { token } = req.body
    
    try {
        jwt.verify(token, process.env.SECRET)
        return res.status(200).json({ valid: true })
    } catch(error) {
        return res.status(401).json({ valid: false, error: 'Invalid token. Go back.' })
    }
})

// Updating the password:
loginRouter.patch('/api/restorePassword', async (req, res) => {
    const { newPassword, token } = req.body

    try {
        const decode = jwt.verify(token, process.env.SECRET)
        const user = await User.findOne({ identifier: decode.identifier })

        if (user) {
            const salt = 10
            const hash = await bcrypt.hash(newPassword, salt)
    
            await User.findByIdAndUpdate(user._id, { passHash: hash })
            return res.status(200).json({ message: 'Passwor updated!' })
        } else {
            return res.status(404).json({ error: 'User not found.' })
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired.' })
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token.' })
        } else {
            return res.status(500).json({ error: 'Internal server error.' })
        }
    }
})

// Processing the logout:
loginRouter.post('/api/logout', async (req, res) => {
    const token = req.get('authorization')?.replace('Bearer ', '')
    const date = new Date()
    const expiration = new Date(date)
    expiration.setDate(date.getDate() + 1)
    expiration.setHours(11, 15, 0, 0)

    if (token) {
        try {
            const blackListItem = new blackList({
                token,
                expiration
            })

            await blackListItem.save()
            return res.status(200).json({ message: 'Successfully logged out!' })
        } catch(error) {
            return res.status(500).json({ error: 'Someting happened when logging out.' })
        }
    }

    return res.status(401).json({ error: 'Unexisting token.' })
})


module.exports = loginRouter