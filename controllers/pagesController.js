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

//GET /book-online
exports.bookOnline = (req, res) => {
  res.render("pages/book-online");
};

//GET /contact-us
exports.contactUS = (req, res) => {
  res.render("pages/contact-us");
};

//GET /login
exports.login = (req, res) => {
  res.render("pages/login");
};

//GET /admin-area
exports.adminArea = (req, res) => {
  res.render("pages/admin-area");
};
