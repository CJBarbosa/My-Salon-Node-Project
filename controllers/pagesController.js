const nodemailer = require("nodemailer");
// GET /
exports.home = (req, res) => {
  res.render("pages/home");
};

// GET /the-stylist
exports.theStylist = (req, res) => {
  res.render("pages/the-stylist");
};

//GET /services
exports.services = (req, res) => {
  res.render("pages/services");
};

//GET /contact-us
exports.contactUSView = (req, res) => {
  res.render("pages/contact-us");
};

async function mainMail(name, email, subject, message) {
  let transporter = nodemailer.createTransport({
    service: "Outlook365",
    host: "smtp.office365.com",
    port: "587",
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOption = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: subject,
    html: `<p>You got a message from:</p> 
    <p>Email : ${email}</p>
    <p>Name: ${name}</p>
    <p>Message: ${message}</p>`,
  };
  try {
    await transporter.sendMail(mailOption);
    return Promise.resolve("Message Sent Successfully!");
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

exports.contactUS = async (req, res, next) => {
  const { name, email, subject, message } = req.body;
  try {
    await mainMail(name, email, subject, message);
    res.render("pages/contact-us", { title: "Message Sent Successfully!" });
    //res.send("Message Successfully Sent!");
  } catch (error) {
    res.render("pages/contact-us", { title: "Message Could not be Sent" });
    //res.send("Message Could not be Sent");
  }
};
