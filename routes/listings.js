const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateSchema } = require("../middleware.js");

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for doesn't exists");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Post Route
router.post(
  "/",
  isLoggedIn,
  validateSchema,
  wrapAsync(async (req, res) => {
    let data = req.body;
    let newListing = new Listing(data);
    console.log(req.user);
    newListing.owner = req.user;
    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("failure", "Listing you requested doesn't exists");
      res.redirect("/listings");
    }
    req.flash("success", "Listing Updated!");
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateSchema,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = req.body;
    await Listing.findByIdAndUpdate(id, data);
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("failure", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
