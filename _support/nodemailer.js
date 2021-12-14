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


JWT_SECRET=hakshuiegagajggajhdavgajdadhakahuadywyvvmzvnvqyiyqyio$%^$$!#

_id
:
61b6770c45be443ef81171db
email
:
"jhondoe@email.com"
password
:
"$2a$10$Cc99HgwLDR3BLrwY/2BZK.M2ILI9W8FpVpOenufVrsjmGypXvvZsO"
__v
:
0
updatedAt
:
2021-12-13T18:45:30.373+00:00


users.json

[{
    "_id": {
      "$oid": "61b6770c45be443ef81171db"
    },
    "email": "jhondoe@email.com",
    "password": "$2a$10$/WSw/ogfUQKQLRTsW06RouEYVqzjN/t.TUqQG5n55VcPhmkLbAzgS",
    "__v": 0,
    "updatedAt": {
      "$date": "2021-12-14T02:04:19.269Z"
    }
  }]