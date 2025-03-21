const User = require("../models/user");

module.exports.getSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.getLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.postSignUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (error) => {
      if (error) {
        return next(error);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("failure", error.message);
    res.redirect("/signup");
  }
};

module.exports.postLogin = async (req, res) => {
  req.flash("success", "Hi, welcome to WanderLust");
  if (res.locals.redirectUrl) {
    res.redirect(res.locals.redirectUrl);
  } else {
    res.redirect("/listings");
  }
};

module.exports.logoutRoute = (req, res, next) => {
  req.logOut((error) => {
    if (error) {
      return next(error);
    }
    req.flash("success", "You logged out!");
    res.redirect("/listings");
  });
};
