const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");
const eventsController = require("../controllers/eventsController");

// Pages routes
router.get("/", pagesController.home);
router.get("/the-stylist", pagesController.theStylist);
router.get("/services", pagesController.services);
router.get("/book-online", pagesController.bookOnline);
router.get("/contact-us", pagesController.contactUS);
router.get("/my-admin-area-login", pagesController.login);
router.get("/admin-area", pagesController.adminArea);

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

module.exports = router;
