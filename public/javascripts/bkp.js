/*const { body, validationResult } = require("express-validator");
const createError = require("http-errors");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
// GET Secret from .envs
const JWT_SECRET = process.env.JWT_SECRET;
const bodyparser = require("body-parser");

const bcrypt = require("bcryptjs");
const salt = 10;

exports.validateForm = [
  // Validate the title and content fields.
  body("email").trim().not().isEmpty().withMessage("Title is required."),
  body("password").trim().not().isEmpty().withMessage("Title is required."),
];

// GET /user
exports.user = (req, res) => {
  const { token } = req.cookies;
  if (verifyToken(token)) {
    return res.render("users/admin-area");
  } else {
    res.redirect("login");
  }
};

// GET /books/books
exports.loginView = (req, res) => {
  res.render("users/login");
};

exports.signupView = (req, res) => {
  res.render("signup");
};

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
    return res.redirect("/admin-area");
  } catch (error) {
    console.log(JSON.stringify(error));
    if (error.code === 11000) {
      //return res.send({ status: "error", error: "email already exists" });
      return res.status(409).send("User Already Exist. Please Login");
    }
    throw error;
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
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
    }); // maxAge: 5 minuts
    res.redirect("admin-area");
  } else {
    res.json(response);
  }
};

// user login function
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

// user verifyToken function
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

const authorization = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.userId = data.id;
    req.userEmail = data.username;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

//GET /logout
exports.logout = (req, res) => {
  return res
    .clearCookie("token")
    .status(200)
    .redirect("login")
    .json({ message: "Successfully logged out" });
};
*/
