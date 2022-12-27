const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      port: process.env.SMTP_PORT,
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendActivationMail(to, link) {
    this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Account activation on " + process.env.SERVER_URL,
      html: `<div>
        <h1>To activate account click to the link</h1>
        <a href="${link}" target="_black" rel="noreferrer">${link}</a>
      </div>`,
    });
  }
}

module.exports = new MailService();
