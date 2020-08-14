const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const nodemailerSendgrid = require('nodemailer-sendgrid');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.userEmail = user.email;
    this.name = user.name;
    if(this.name){
      this.firstName = user.name.split(' ')[0];
    }
    this.message = user.message;
    this.url = url;
    this.from = `Leo Garza <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if(process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport(
        nodemailerSendgrid({
          apiKey: process.env.SENDGRID_PASSWORD
        })
      )
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  
  

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      name: this.name,
      userEmail: this.userEmail,
      firstName: this.firstName,
      message: this.message,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Music Family!');
  }

  async sendToHost(){
    await this.send('toHost', 'You got a new message! - Contact Page');
  }

  async sendToHostSubscriber(){
    await this.send('subscriber', 'You got a new subcriber! - Footer Section');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
  
};