const Listing = require("../models/listings.js");

module.exports.indexRoute = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newRoute = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("failure", "Listing you requested for doesn't exists");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.postRoute = async (req, res) => {
  let data = req.body;
  console.log(req.file);
  let newListing = new Listing(data);
  newListing.owner = req.user;
  await newListing.save();
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

module.exports.editRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("failure", "Listing you requested doesn't exists");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing Updated!");
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateRoute = async (req, res) => {
  let { id } = req.params;
  let data = req.body;
  await Listing.findByIdAndUpdate(id, data);
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteRoute = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("failure", "Listing Deleted!");
  res.redirect("/listings");
};
