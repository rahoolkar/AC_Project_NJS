const Listing = require("./models/listings");
const myError = require("./utils/myError.js");
const { listingSchema } = require("./schema.js");

const isLoggedIn = function (req, res, next) {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("failure", "You have to log-in first to create a listing!");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = function (req, res, next) {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isOwner = async function (req, res, next) {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser)) {
    req.flash("failure", "You don't have permission to perform this opertion");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//middleware for the post route
const validateSchema = function (req, res, next) {
  let data = req.body;
  let result = listingSchema.validate(data);
  if (result.error) {
    throw new myError(400, "Please provide valid data");
  } else {
    next();
  }
};

module.exports = { isLoggedIn, saveRedirectUrl, isOwner, validateSchema };
