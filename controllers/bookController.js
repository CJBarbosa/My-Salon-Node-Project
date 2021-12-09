const createError = require("http-errors");
const Event = require("../models/event");

// GET /events
exports.list = (req, res, next) => {
  /* Search from-to dates
    let startingDate = "2021-12-01";
    let endDate = "2021-12-03";
    Event.find({ date: { $gte: startingDate, $lte: endDate } })*/
  //const the_date = ;
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
        res.render("events/teste", {
          title: "Schedules",
          events: events,
        });
      }
    });
};
