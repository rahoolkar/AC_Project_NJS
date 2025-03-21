const express = require("express");
const router = express.Router();
const wrapAysnc = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const {
  getSignup,
  getLogin,
  postSignUp,
  postLogin,
  logoutRoute,
} = require("../controllers/users.js");

router.get("/signup", getSignup);

router.get("/login", getLogin);

router.post("/signup", wrapAysnc(postSignUp));

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAysnc(postLogin)
);

router.get("/logout", logoutRoute);

module.exports = router;
