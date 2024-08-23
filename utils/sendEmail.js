const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const sendEmail = async (email, subject, payload, template) => {
  try {
    //Create a transport object
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
      }
    });

    //Request email template
    const source = fs.readFileSync(path.join(__dirname, template), 'utf8');
    const compiledTamplate = handlebars.compile(source);

    const option = () => {
      return {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: compiledTamplate(payload)
      };
    };

    //send email
    transporter.sendMail(option(), (err, info) => {
      if (err) {
        return err;
      }
    });
  } catch (err) {
    return err;
  }
};

module.exports = sendEmail;
