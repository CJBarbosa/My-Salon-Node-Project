const nodemailer = require("nodemailer");

const { body, validationResult } = require("express-validator");
const createError = require("http-errors");
const Event = require("../models/event");

exports.validateForm = [
  // Validate the title and content fields.
  body("firstName").trim().not().isEmpty().withMessage("Title is required."),
  body("lastName").trim().not().isEmpty().withMessage("Title is required."),
  body("email").trim().not().isEmpty().withMessage("Title is required."),
  body("phone").trim().not().isEmpty().withMessage("Title is required."),
];

// GET /books
exports.list = (req, res, next) => {
  Event.find({
    date: {
      $gte: new Date().toLocaleDateString("en-CA"),
      $lte: new Date(
        new Date().setDate(new Date().getDate() + 7)
      ).toLocaleDateString("en-CA"),
    },
  })
    .sort({ date: 1 })
    .exec((err, events) => {
      if (err) {
        next(err);
      } else {
        res.render("books/book-online", {
          title: "Schedules",
          events: events,
        });
      }
    });
};

// GET /events/create
exports.createView = (req, res, next) => {
  Event.find({ date: req.params.date })
    .sort({ index: 1 })
    .limit(16)
    .exec((err, events) => {
      if (err) {
        next(err);
      } else {
        res.render("books/create", {
          title: `Create an Appointment on ${new Date(req.params.date)
            .toUTCString()
            .slice(0, 16)}`,
          date: req.params.date,
          index: req.params.index,
          option: req.query.option,
          events: events,
        });
      }
    });
};

//Function used on Forget Password Router
async function mainMail(link, email, date, schedule) {
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "969396363e67ba",
      pass: "f3de49be60089c",
    },
  });

  const mailOption = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "My Salon - Appointment created!",
    html: `<p>Thank you for booking an appointment with us!</p>
    <p>Here are the details:</p>
    <p>DATE: ${date}</p>
    <p>SCHEDULE: ${schedule}</p>
    <p>If for any reason you decided to cancel your appointment, please give us a call at 204-441-8080
    or you can just click in the link below and cancel it.</p> 
    <p>Link : <a href="${link}">${link}</a></p>
    <p>Please, note: This is an automatic message, please do not replay.</small></p>`,
  };

  await transporter.sendMail(mailOption);
  return;
}

// POST /books/create
exports.create = (req, res, next) => {
  // Check request's validation result. Wrap errors in an object with useful functions.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("events/create", {
      event: req.body,
      errors: errors.array(),
    });
  }
  Event.create(req.body, (err, event) => {
    if (err) {
      return next(err);
    }
    const link = `http://localhost:${process.env.SERVER_PORT}/cancel-appointment/${event.id}`;
    // Sent the link to the users email -----------------------------------------
    mainMail(link, event.email, event.date, event.schedule);
    if (err) {
      next(err);
    }
    res.redirect(`/books/${event.id}`);
  });
};

// GET /books/:id
exports.details = (req, res, next) => {
  Event.findById(req.params.id, (err, event) => {
    // if id not found mongoose throws CastError.
    if (err || !event) {
      next(createError(404));
    } else {
      res.render("books/details", {
        title: "Schedule successfully created",
        event: event,
      });
    }
  });
};

// POST events/:id/delete
exports.cancelAppointment = (req, res, next) => {
  Event.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.send(
        "<div stayle='display: table; margin-top:200px'><h1>Appointment canceled!</h1></div>"
      );
    }
  });
};
