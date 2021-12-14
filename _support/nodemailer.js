module.exports = function (options) {
  const nodemailer = require("nodemailer");
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    service: "Outlook365",
    host: "smtp.office365.com",
    port: "587",
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  
  var mailOptions = {
    from: address, //origin
    to: to, // list of receivers
    subject: subject, // Subject line
    text: 'Hey there, it’s our first message sent with Nodemailer ',
    html: html, // html body    
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
};
