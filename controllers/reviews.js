const Listing = require("../models/listings");
const Review = require("../models/review.js");

module.exports.deleteReview = async (req, res) => {
  let { id, rid } = req.params;
  let review = await Review.findById(rid).populate("author");
  if (review.author.equals(req.user) == false) {
    req.flash("failure", "You are not allowed to delete review");
    return res.redirect(`/listings/${id}`);
  }
  await Review.findByIdAndDelete(rid);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } });
  req.flash("failure", "Review deleted!");
  res.redirect(`/listings/${id}`);
};

module.exports.postReview = async (req, res) => {
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
};
