const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync.js");
const myError = require("../utils/myError.js");
const {listingSchema} = require("../schema.js");


//middleware for the post route
const validateSchema = function(req,res,next){
    let data = req.body;
    let result = listingSchema.validate(data);
    if(result.error){
        throw new myError(400,"Please provide valid data");
    }else{
        next();
    }
}

//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id",(wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
})));

//Post Route
router.post("/",validateSchema,wrapAsync(async (req,res)=>{
    let data = req.body;
    let newListing = new Listing(data);
    await newListing.save();
    req.flash('success', 'New Listing created!')
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    req.flash("success","Listing Updated!")
    res.render("listings/edit.ejs",{listing});
}));

router.put("/:id",validateSchema,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let data = req.body;
    await Listing.findByIdAndUpdate(id,data);
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;