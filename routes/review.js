const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn } = require("../middleware.js");

//Post Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = req.body;
    let newReview = new Review(data);
    newReview.author = req.user;
    let reviewSaved = await newReview.save();
    let listing = await Listing.findById(id);
    listing.reviews.push(reviewSaved);
    await listing.save();
    req.flash("success", "New review created!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:rid",
  wrapAsync(async (req, res) => {
    let { id, rid } = req.params;
    let review = await Review.findById(rid);
    if(!review.author.equals(req.user)){
        req.flash("failure","You are not allowed to delete review");
        res.redirect(`/listings/${id}`);
    }
    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    req.flash("failure", "Review deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
