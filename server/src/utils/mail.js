import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
export default async function mailer(receiver, title, text, html) {
  let transporter = nodemailer.createTransport(
    smtpTransport({
      host: "ssl0.ovh.net",
      port: 465,
      secure: true, 
      auth: {
        user: "patryk@saganowski.ovh", 
        pass: process.env.PASSWORD_MAIL, 
      },
    })
  );
  let info = await transporter.sendMail({
    from: '"[no-reply] Administrator" <patryk@saganowski.ovh>', 
    to: receiver, 
    subject: title, 
    text: text, 
    html: html,
  });
}
