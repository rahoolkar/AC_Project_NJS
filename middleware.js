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

module.exports = { isLoggedIn, saveRedirectUrl };
