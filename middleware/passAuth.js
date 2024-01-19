// const passport = require('passport')
// const LocalStratetgy = require('passport-local').Strategy
// const User = require('../models/user')

// const configPassword = (rut = '11.111.111-1', password = 'icmufmoudfnm1283') => {
//     // console.log(rut, password)
//     passport.use(new LocalStratetgy((providedRut, prodone) => {
//         User.findOne({ rut: rut }, (error, user) => {
//             if (error) { return done(error) }
//             if (!user) { return done(null, false) }
//             if (!user.verifyPassword(password)) { return done(null, false, {message: 'Datos incorrectos!' }) }
//             return done(null, user)
//         })
//     }))
    
//     passport.serializeUser((user, done) => {
//         done(null, user.id)
//     })
    
//     passport.deserializeUser((id, done) => {
//         User.findById(id, (error, user) => {
//             done(error, user)
//         })
//     })
// }

// module.exports = configPassword