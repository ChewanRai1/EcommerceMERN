// Dependencies and Modules
const express = require("express");
const newsController = require("../controllers/news");
const auth = require("../auth");

const {verify, verifyAdmin} = auth;

// Routing Component
const router = express.Router();

// Route for creating a news
router.post("/", verify, verifyAdmin, newsController.addNews);

// Route for retrieving all news
router.get("/all", verify, verifyAdmin, newsController.getAllNews);

// Route for retrieving all active news
router.get("/", newsController.getAllActive);

// Route for retrieving a specific news
router.get("/specific/:newsId", newsController.getNews);

// Route for updating a news (Admin)
router.patch("/:newsId", verify, verifyAdmin, newsController.updateNews);

// Route to archiving a news (Admin)
// router.patch("/:newsId/archive", verify, verifyAdmin, newsController.archiveNews);

// Route to activating a news (Admin)
// router.patch("/:newsId/activate", verify, verifyAdmin, newsController.activateNews);

// Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;