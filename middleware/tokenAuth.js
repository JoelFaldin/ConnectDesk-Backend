const jwt = require('jsonwebtoken')

const getToken = res => {
    const authorization = res.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '') 
    }
    return null
}

const tokenMiddleware = async (req, res, next) => {
    const decodedToken = jwt.verify(getToken(req), process.env.SECRET)
    
    if (!decodedToken.rut) {
        return res.status(401).json({ error: 'Token Inválido' })
    }

    next()
}

module.exports = tokenMiddleware