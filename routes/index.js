const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");
const eventsController = require("../controllers/eventsController");
const booksController = require("../controllers/booksController");
const usersController = require("../controllers/usersController");

// Pages routes
router.get("/", pagesController.home);
router.get("/the-stylist", pagesController.theStylist);
router.get("/services", pagesController.services);
router.get("/contact-us", pagesController.contactUSView);
router.post("/contact-us", pagesController.contactUS);

//Book routers
router.get("/book-online", booksController.list);
router.get("/books/create/:date/:index", booksController.createView);
router.post(
  "/books/create",
  booksController.validateForm,
  booksController.create
);
router.get("/books/:id", booksController.details);
router.get("/cancel-appointment/:id", booksController.cancelAppointment);

// Events routes
router.get("/events", eventsController.list);
router.get("/events/create", eventsController.createView);
router.post(
  "/events/create",
  eventsController.validateForm,
  eventsController.create
);
router.get("/events/:id", eventsController.details);
router.get("/events/:id/update", eventsController.updateView);
router.post(
  "/events/:id/update",
  eventsController.validateForm,
  eventsController.update
);
router.get("/events/:id/delete", eventsController.deleteView);
router.post("/events/:id/delete", eventsController.delete);

//Users routers
router.get("/admin-area", usersController.adminArea);
router.get("/users/login", usersController.loginView);
router.post("/users/login", usersController.login);
router.get(
  "/users/logout",
  usersController.authorization,
  usersController.logout
);
router.get(
  "/users/change-pass",
  usersController.authorization,
  usersController.changePassView
);
router.post(
  "/users/change-pass",
  usersController.authorization,
  usersController.changePass
);
router.get(
  "/users/create-admin",
  usersController.authorization,
  usersController.createAdminView
);
router.post(
  "/users/create-admin",
  usersController.validateForm,
  usersController.createAdmin
);
router.get(
  "/users/delete-admin",
  usersController.authorization,
  usersController.deleteAdminView
);
router.post("/users/delete-admin", usersController.deleteAdmin);
router.get("/users/forgot-pass", usersController.forgotPassView);
router.post("/users/forgot-pass", usersController.forgotPass);
router.get(
  "/reset-password-by-email/:id/:token",
  usersController.resetPassByEmail,
  usersController.authorization
);

module.exports = router;
