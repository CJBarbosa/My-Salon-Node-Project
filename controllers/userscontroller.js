const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const salt = 10;

// GET Secret from .envs
const JWT_SECRET = process.env.JWT_SECRET;

exports.validateForm = [
  // Validate the title and content fields.
  body("email").trim().not().isEmpty().withMessage("Title is required."),
  body("password").trim().not().isEmpty().withMessage("Title is required."),
];

// GET /users/change-pass
exports.createAdminView = (req, res) => {
  res.render("users/create-admin");
};

// POST /user/signup
exports.createAdmin = async (req, res) => {
  // geting our data from frontend
  const { email, password: plainTextPassword } = req.body;
  // encrypting our password to store in database
  const password = await bcrypt.hash(plainTextPassword, salt);
  try {
    // storing our user data into database
    const response = await User.create({
      email,
      password,
    });
    return res.render("users/admin-area", {
      title: "Admin created Successfully",
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    if (error.code === 11000) {
      //return res.send({ status: "error", error: "email already exists" });
      return res.render("users/admin-area", {
        title: "User Already Exist. Please Login",
      });
      //res.status(409).send("User Already Exist. Please Login");
    }
    throw error;
  }
};

// user login function**
const verifyUserLogin = async (email, password) => {
  try {
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return { status: "error", error: "user not found" };
    }

    if (await bcrypt.compare(password, user.password)) {
      // creating a JWT token
      token = jwt.sign(
        { id: user._id, email: user.email, type: "user" },
        JWT_SECRET
      );
      return { status: "ok", data: token };
    }
    return { status: "error", error: "invalid password" };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "timed out" };
  }
};

//POST /users login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  //Function to verify our user login
  const response = await verifyUserLogin(email, password);
  if (response.status === "ok") {
    // storing JWT web token as a cookie in browser
    res.cookie("token", token, {
      maxAge: 15 * 60 * 1000, //15 minuts
      httpOnly: true,
    }); // maxAge: 15 minuts
    res.redirect("/admin-area");
  } else {
    res.render("users/login", { title: JSON.stringify(response.error) });
  }
};

//MIDDLEWARE /users
exports.authorization = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized user!!" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.userId = data.id;
    console.log("userId", req.userId);
    req.userEmail = data.email;
    console.log("userEmail", req.userEmail);
    next();
  } catch {
    return res.sendStatus(403);
  }
};

//GET /users logout
exports.logout = (req, res) => {
  return res.clearCookie("token").status(200).redirect("/");
  /*.json({ message: "Successfully logged out" });*/
};

 
const verifyToken = (token) => {
  try {
    const verify = jwt.verify(token, JWT_SECRET);
    if (verify.type === "user") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(JSON.stringify(error), "error");
    return false;
  }
};

//GET /users admin area
exports.adminArea = (req, res) => {
  const { token } = req.cookies;
  if (verifyToken(token)) {
    return res.render("users/admin-area");
  } else {
    res.redirect("users/login");
  }
};

// GET /users login
exports.loginView = (req, res) => {
  res.render("users/login");
};

//Get /users signup
exports.signupView = (req, res) => {
  res.render("signup");
};

// GET /users/change-pass
exports.changePassView = (req, res) => {
  res.render("users/change-pass");
};

// POST /users/reset-password
exports.changePass = async (req, res, next) => {
  // encrypting password to store in database 
  const newpassword = await bcrypt.hash(req.body.newPass, salt);
  // Specify the fields that can be updated.
  const user = { password: newpassword };  

  User.findByIdAndUpdate(req.userId, user, { new: true }, (err) => {
    if (err) {
      return next(err);
    }
    res.render("users/admin-area", { title: "Password Reset Successfully" });
  });
};

// GET /users/change-pass
exports.deleteAdminView = (req, res) => {
  res.render("users/delete-admin");
};

// POST users/:id/delete
exports.deleteAdmin = (req, res, next) => {
  User.findOneAndDelete({ email: req.body.email }, (err, docs) => {
    if (err || !docs) {
      res.render("users/delete-admin", {
        title: "Admin not found!",
      });
      //next(err);
    } else {
      res.render("users/admin-area", { title: "Admin Deleted Successfully" });
    }
  });
};

// GET /users/forgot-pass
exports.forgotPassView = (req, res) => {
  res.render("users/forgot-pass");
};

//Function used on Forget Password Router
async function mainMail(email, link) {
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOption = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "My Salon - Forgot Password Procedures",
    html: `<p>In order to recover access to Admin Area, Please click on the link provided:</p> 
    <p>Link : <a href="${link}">${link}</a></p>
    <p>Please, note: This link will expire 15 minutes after your request.</p>
    <p><small>This is an automatic message, please do not replay.</small></p>`,
  };

  await transporter.sendMail(mailOption);
  return;
}

// POST /users/:id/delete
exports.forgotPass = (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      res.render("users/forgot-pass", {
        title: "Admin not found!",
      });
      //next(err);
    } else {
      //Create Token with 15m expiration
      token = jwt.sign(
        { id: user._id, email: user.email, type: "user", expiresIn: "15m" },
        JWT_SECRET
      );
      const link = `http://localhost:${process.env.SERVER_PORT}/reset-password-by-email/${user.id}/${token}`;
      // Sent the link to the users email -----------------------------------------

      mainMail(user.email, link);
      if (err) {
        return res.render("users/forgot-pass", {
          title: "Message Could not be Sent",
        });
      }
      res.render("users/login", {
        title: "Success! Check your e-mail!",
      });
    }
  });
};

//GET /reset-password-by-email
exports.resetPassByEmail = (req, res, next) => {
  const { id, token } = req.params;
  try {
    //verify if token is value and if it is not expired
    const data = jwt.verify(token, JWT_SECRET);
    // storing JWT web token as a cookie in the browser
    res.cookie("token", token, {
      maxAge: 15 * 60 * 1000, //15 minuts
      httpOnly: true,
    }); // maxAge: 15 minuts
    //Redirect Admin to Change-pass page.
    return res.render("users/change-pass", {
      title: "Enter with new Password",
    });
  } catch {
    return res.render("users/login", {
      title: "Token expired or not value",
    });
  }
};
