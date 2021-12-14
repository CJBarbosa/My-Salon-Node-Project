//const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");

const { body, validationResult } = require("express-validator");
//const createError = require("http-errors");
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

// POST /user/signup
exports.signup = async (req, res) => {
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
    return res.redirect("admin-area");
  } catch (error) {
    console.log(JSON.stringify(error));
    if (error.code === 11000) {
      //return res.send({ status: "error", error: "email already exists" });
      return res.status(409).send("User Already Exist. Please Login");
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
        { id: user._id, username: user.email, type: "user" },
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

//POST login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  // we made a function to verify our user login
  const response = await verifyUserLogin(email, password);
  if (response.status === "ok") {
    // storing our JWT web token as a cookie in our browser
    res.cookie("token", token, {
      maxAge: 15 * 60 * 1000, //15 minuts
      httpOnly: true,
    }); // maxAge: 5 minuts
    res.redirect("/admin-area");
  } else {
    /*res.redirect(`/users/login?info=${json(response)}`);*/
    //console.log(JSON.stringify(error));

    res.render("users/login", { title: JSON.stringify(response.error) });
  }
};

exports.authorization = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized user!!" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.userId = data.id;
    console.log("userId", req.userId);
    req.userEmail = data.username;
    console.log("userEmail", req.userEmail);
    next();
  } catch {
    return res.sendStatus(403);
  }
};

//**
exports.logout = (req, res) => {
  return res.clearCookie("token").status(200).redirect("/");
  /*.json({ message: "Successfully logged out" });*/
};

//**
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

// get requests **
exports.adminArea = (req, res) => {
  const { token } = req.cookies;
  if (verifyToken(token)) {
    return res.render("users/admin-area");
  } else {
    res.redirect("users/login");
  }
};

// GET /books/books
exports.loginView = (req, res) => {
  res.render("users/login");
};

exports.signupView = (req, res) => {
  res.render("signup");
};

// GET /users/change-pass
exports.changePassView = (req, res) => {
  res.render("users/change-pass");
};

// POST /users/reset-password
exports.changePass = async (req, res, next) => {
  // encrypting our password to store in database
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
