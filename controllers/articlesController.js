const { body, validationResult } = require("express-validator");
const createError = require("http-errors");
const Article = require("../models/article");

exports.validateForm = [
  // Validate the title and content fields.
  body("firstName").trim().not().isEmpty().withMessage("Title is required."),
  body("lastName").trim().not().isEmpty().withMessage("Title is required."),
  body("email").trim().not().isEmpty().withMessage("Title is required."),
  body("phone").trim().not().isEmpty().withMessage("Title is required."),
];

// GET /articles
exports.list = (req, res, next) => {
  /* Search from-to dates
  let startingDate = "2021-12-01";
  let endDate = "2021-12-03";
  Article.find({ date: { $gte: startingDate, $lte: endDate } })*/
  //const the_date = ;
  Article.find({ date: req.query.date })
    .sort({ index: 1 })
    .limit(16)
    .exec((err, articles) => {
      if (err) {
        next(err);
      } else {
        res.render("articles/list", {
          title: "Schedules",
          articles: articles,
          date: req.query.date,
        });
      }
    });
};

// GET /articles/:id
exports.details = (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    // if id not found mongoose throws CastError.
    if (err || !article) {
      next(createError(404));
    } else {
      res.render("articles/details", {
        title: "Schedule Details",
        article: article,
      });
    }
  });
};

// GET /articles/create
exports.createView = (req, res, next) => {
  Article.find({ date: req.query.date })
    .sort({ index: 1 })
    .limit(16)
    .exec((err, articles) => {
      if (err) {
        next(err);
      } else {
        res.render("articles/create", {
          title: `Create an Appointment on ${new Date(req.query.date)
            .toUTCString()
            .slice(0, 16)}`,
          articles: articles,
          date: req.query.date,
        });
      }
    });
};

// POST /articles/create
exports.create = (req, res, next) => {
  // Check request's validation result. Wrap errors in an object with useful functions.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("articles/create", {
      article: req.body,
      errors: errors.array(),
    });
  }
  Article.create(req.body, (err, article) => {
    if (err) {
      return next(err);
    }
    res.redirect(`/articles/${article.id}`);
  });
};

// GET /articles/:id/update
exports.updateView = (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    // if id not found throws CastError.
    if (err || !article) {
      next(createError(404));
    } else {
      res.render("articles/update", {
        title: "Edit your Schedule Information",
        article: article,
      });
    }
  });
};

// POST /articles/:id/update
exports.update = async (req, res, next) => {
  // Specify the fields that can be updated. Assign id from the request route's id parameter.
  const article = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    _id: req.params.id,
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("articles/update", {
      article: article,
      errors: errors.array(),
    });
  }
  Article.findByIdAndUpdate(req.params.id, article, { new: true }, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect(`/articles/${article._id}`);
  });
};

// GET /articles/:id/delete
exports.deleteView = (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    // if id not found throws CastError.
    if (err || !article) {
      next(createError(404));
    } else {
      res.render("articles/delete", {
        title: "Delete Schedule",
        article: article,
      });
    }
  });
};

// POST articles/:id/delete
exports.delete = (req, res, next) => {
  Article.findByIdAndRemove(req.body.id, (err) => {
    if (err) {
      next(err);
    } else {
      res.redirect(`/articles?date=${req.body.date}`);
    }
  });
};
