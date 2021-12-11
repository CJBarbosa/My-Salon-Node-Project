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

// GET /events
exports.list = (req, res, next) => {
  /* Search from-to dates
  let startingDate = "2021-12-01";
  let endDate = "2021-12-03";
  Event.find({ date: { $gte: startingDate, $lte: endDate } })*/
  //const the_date = ;
  Event.find({ date: req.query.date })
    .sort({ index: 1 })
    .limit(16)
    .exec((err, events) => {
      if (err) {
        next(err);
      } else {
        res.render("events/list", {
          title: "Schedules",
          events: events,
          date: req.query.date,
        });
      }
    });
};

// GET /events/:id
exports.details = (req, res, next) => {
  Event.findById(req.params.id, (err, event) => {
    // if id not found mongoose throws CastError.
    if (err || !event) {
      next(createError(404));
    } else {
      res.render("events/details", {
        title: "Schedule Details",
        event: event,
      });
    }
  });
};

// GET /events/create
exports.createView = (req, res, next) => {
  Event.find({ date: req.query.date })
    .sort({ index: 1 })
    .limit(16)
    .exec((err, events) => {
      if (err) {
        next(err);
      } else {
        res.render("events/create", {
          title: `Create an Appointment on ${new Date(req.query.date)
            .toUTCString()
            .slice(0, 16)}`,
          events: events,
          date: req.query.date,
        });
      }
    });
};

// POST /events/create
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
    res.redirect(`/events/${event.id}`);
  });
};

// GET /events/:id/update
exports.updateView = (req, res, next) => {
  Event.findById(req.params.id, (err, event) => {
    // if id not found throws CastError.
    if (err || !event) {
      next(createError(404));
    } else {
      res.render("events/update", {
        title: "Edit your Schedule Information",
        event: event,
      });
    }
  });
};

// POST /events/:id/update
exports.update = async (req, res, next) => {
  // Specify the fields that can be updated. Assign id from the request route's id parameter.
  const event = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    _id: req.params.id,
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("events/update", {
      event: event,
      errors: errors.array(),
    });
  }
  Event.findByIdAndUpdate(req.params.id, event, { new: true }, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect(`/events/${event._id}`);
  });
};

// GET /events/:id/delete
exports.deleteView = (req, res, next) => {
  Event.findById(req.params.id, (err, event) => {
    // if id not found throws CastError.
    if (err || !event) {
      next(createError(404));
    } else {
      res.render("events/delete", {
        title: "Delete Schedule",
        event: event,
      });
    }
  });
};

// POST events/:id/delete
exports.delete = (req, res, next) => {
  Event.findByIdAndRemove(req.body.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.redirect(`/events?date=${req.body.date}`);
    }
  });
};
