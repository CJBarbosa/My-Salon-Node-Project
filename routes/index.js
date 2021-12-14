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
//router.get("/book-online", pagesController.bookOnline);
router.get("/contact-us", pagesController.contactUS);
//router.get("/my-admin-area-login", pagesController.login);
//router.get("/admin-area", pagesController.adminArea);

//Book routers
router.get("/book-online", booksController.list);
router.get("/books/create/:date/:index", booksController.createView);
router.post(
  "/books/create",
  booksController.validateForm,
  booksController.create
);
//router.get("/books/books", booksController.books);
router.get("/books/:id", booksController.details);

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
router.post("/users/signup", usersController.signup);
router.post("/users/login", usersController.login);
router.get("/users/logout", usersController.logout);
router.get("/admin-area", usersController.adminArea);
router.get("/users/login", usersController.loginView);
router.get("/users/signup", usersController.signupView);
router.get("/users/change-pass", usersController.changePassView);
router.post(
  "/users/change-pass",
  usersController.authorization,
  usersController.changePass
);
router.get("/users/admin-options", usersController.adminOptions);


module.exports = router;
