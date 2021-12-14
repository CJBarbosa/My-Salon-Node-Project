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
exports.contactUS = (req, res) => {
  res.render("pages/contact-us");
};
