const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
async function mailer(receiver, title, text, html) {
  let transporter = nodemailer.createTransport(
    smtpTransport({
      host: "ssl0.ovh.net",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "patryk@saganowski.ovh", // generated ethereal user
        pass: process.env.PASSWORD_MAIL, // generated ethereal password
      },
    })
  );
  let info = await transporter.sendMail({
    from: '"[DEV] Administrator" <patryk@saganowski.ovh>', // sender address
    to: receiver, // list of receivers
    subject: title, // Subject line
    text: text, // plain text body
    html: html, // html body
  });
}

module.exports = mailer;