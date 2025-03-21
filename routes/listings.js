const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateSchema } = require("../middleware.js");
const {indexRoute,newRoute,showRoute,postRoute,updateRoute,deleteRoute,editRoute} = require("../controllers/listings.js");

//Index Route
router.get("/", wrapAsync(indexRoute));

//New Route
router.get("/new", isLoggedIn,newRoute);

//Show Route
router.get("/:id", wrapAsync(showRoute));

//Post Route
router.post("/", isLoggedIn, validateSchema, wrapAsync(postRoute));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editRoute));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateSchema, wrapAsync(updateRoute));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteRoute));

module.exports = router;
