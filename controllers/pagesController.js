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
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.USER_EMAI,
      pass: process.env.EMAIL_PASS,
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

//POST /contact-us
exports.contactUS = async (req, res, next) => {
  const { name, email, subject, message } = req.body;
  try {
    await mainMail(name, email, subject, message);
    res.render("pages/contact-us", { title: "Message Sent Successfully!" });
  } catch (error) {
    res.render("pages/contact-us", { title: "Message Could not be Sent" });
  }
};
