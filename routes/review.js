const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn } = require("../middleware.js");
const { deleteReview, postReview } = require("../controllers/reviews.js");

//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(postReview));

//Delete Route
router.delete("/:rid", wrapAsync(deleteReview));

module.exports = router;
