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

// GET /books/create
exports.createView = (req, res, next) => {  
  res.render("books/create", {
    title: `Create an Appointment on ${new Date(req.params.date)
    .toUTCString()
    .slice(0, 16)}`,
    date: req.params.date,
    index: req.params.index,    
  });
};

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
    res.redirect(`/books/${event.id}`);
  });
};

// GET /events/:id
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