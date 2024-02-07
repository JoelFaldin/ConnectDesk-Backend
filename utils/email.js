const nodemailer = require('nodemailer')

const send = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'muniemail22@gmail.com',
        pass: 'muniPass73]+'
    }
})

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
      from: 'muniemail@gmail.com',
      to,
      subject,
      text,
    }

    try {
      // const info = await send.sendMail(mailOptions)
      // console.log('Correo enviado: ' + info.response)
      console.log(text)
    } catch (error) {
      console.error('Error enviando el correo de recuperación de contraseña: ', error)
    }
}

module.exports = sendEmail
