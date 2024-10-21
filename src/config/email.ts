import { InternalServerErrorException } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { envs } from 'src/config';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: envs.EMAIL_ADDRESS,
    pass: envs.EMAIL_PASS,
  },
});

const sendEmail = async (to: string, subject: string, content: string) => {
  const mailOptions = {
    from: envs.EMAIL_ADDRESS,
    to,
    subject,
    text: content,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new InternalServerErrorException(
      'There was a problem trying to send the email, try again later.',
    );
  }
};

export default sendEmail;
