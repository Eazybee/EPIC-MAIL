import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

class Utility {
  static getToken(payload, expiresIn = '1h') {
    dotenv.config();
    const token = jwt.sign({ payload }, process.env.JWT_PRIVATE_SECRET, { expiresIn });
    return token;
  }

  static mail(to, token) {
    const endpoint = 'http://127.0.0.1:5500/UI/pages/loginPage.html';
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: 'no-reply@robot.com',
      to,
      subject: 'EPICMAIL: Password Reset Confirmation',
      html: `<p>Confirm password reset on your epicmail account: <a href='${endpoint}?r=${token}'>Confirm Password Reset</a></p>
             <p>Ignore if this password request was not made by you. Stay EPIC!</p>`,
    };

    return transporter.sendMail(mailOptions);
  }

  static handleError(res, errorMessage, status = 400) {
    const error = errorMessage.replace(/"/g, "'");
    res.status(status).json({
      status,
      error,
    });
  }
}
export default Utility;
