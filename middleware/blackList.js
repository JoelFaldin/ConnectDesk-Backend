const BlackList = require('../models/blackList')

const blackListMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    // console.log(token, typeof token)

    // console.log(token === 'null' || token === null)

    if (token) {
        const exists = await BlackList.exists({ token })
    
        if (exists) {
          return res.status(401).json({ error: 'Invalid Token' })
        }
        if (token === 'null' || token === null) {
          return res.status(401).json({ error: 'Invalid Token' })
        }
    }
    if (token === 'null' || token === null) {
        return res.status(401).json({ error: 'Invalid Token' })
    }

    
      next();
}

module.exports = blackListMiddleware