const nodemailer = require('nodemailer');
const catchAsync = require('./../utils/catchAsync');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Mail(user, welcome || reset Password || etc).sendWelcome().resetPass()
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = `${user.name}`.split(' ')[0];
    this.url = url;
    this.from = `Natours Support <${process.env.EMAIL_FROM}>`;
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_PROD,
        port: process.env.EMAIL_PORT_PROD,
        auth: {
          user: process.env.EMAIL_LOGIN_PROD,
          pass: process.env.EMAIL_KEY_PROD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST_DEV,
      port: process.env.EMAIL_PORT_DEV,
      auth: {
        user: process.env.EMAIL_USERNAME_DEV,
        pass: process.env.EMAIL_PASSWORD_DEV,
      },
    });
  }

  async send(template, subject) {
    //get the rendered html page
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstname: this.firstname,
        url: this.url,
        subject,
      },
    );

    //create mail options
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    //send the email
    await this.newTransporter().sendMail(emailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes)',
    );
  }
};
