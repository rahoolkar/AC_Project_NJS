const isLoggedIn = function (req, res, next) {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash("failure", "You have to log-in first to create a listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports = { isLoggedIn };
