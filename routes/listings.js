const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateSchema } = require("../middleware.js");
const {
  indexRoute,
  newRoute,
  showRoute,
  postRoute,
  updateRoute,
  deleteRoute,
  editRoute,
} = require("../controllers/listings.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

//router.route
router
  .route("/")
  .get(wrapAsync(indexRoute))
  .post(isLoggedIn,upload.single('image'), wrapAsync(postRoute));

//New Route
router.get("/new", isLoggedIn, newRoute);

router
  .route("/:id")
  .get(wrapAsync(showRoute))
  .put(isLoggedIn, isOwner, validateSchema, wrapAsync(updateRoute))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteRoute));

//Index Route
//router.get("/", wrapAsync(indexRoute));

//Show Route
// router.get("/:id", wrapAsync(showRoute));

//Post Route
// router.post("/", isLoggedIn, validateSchema, wrapAsync(postRoute));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editRoute));

//Update Route
// router.put("/:id", isLoggedIn, isOwner, validateSchema, wrapAsync(updateRoute));

//Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteRoute));

module.exports = router;
