const express = require("express");
const router = express.Router();
const wrapAysnc = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/signup",
  wrapAysnc(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      let registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    } catch (error) {
      req.flash("failure", error.message);
      res.redirect("/signup");
    }
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAysnc(async (req, res) => {
    req.flash("success","hi, welcome to wanderlust");
    res.redirect("/listings");
  })
);

module.exports = router;
