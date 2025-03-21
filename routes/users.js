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

router
  .route("/login")
  .get(getLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAysnc(postLogin)
  );

router.route("/signup").get(getSignup).post(wrapAysnc(postSignUp));

router.get("/logout", logoutRoute);

module.exports = router;
