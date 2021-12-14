const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");
const booksController = require("../controllers/booksController");
const eventsController = require("../controllers/eventsController");
const usersController = require("../controllers/usersController");

// Pages routes
router.get("/", pagesController.home);
router.get("/the-stylist", pagesController.theStylist);
router.get("/services", pagesController.services);
router.get("/contact-us", pagesController.contactUS);

//Book routers
router.get("/book-online", booksController.list);
router.get("/books/create/:date/:index", booksController.createView);
router.post(
  "/books/create",
  booksController.validateForm,
  booksController.create
);
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

//Users router
router.get("/admin-area", usersController.adminArea);
router.get("/login", usersController.loginView);
router.post("/login", usersController.login);
router.get("/signup", usersController.signupView);
router.post("/signup", usersController.signup);
router.get("/logout", usersController.logout);

module.exports = router;
