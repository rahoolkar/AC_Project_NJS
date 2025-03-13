const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync.js");
const myError = require("../utils/myError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");

//middleware for the review post route
const validateReview = function(req,res,next){
    let data = req.body;
    let result = reviewSchema.validate(data);
    if(result.error){
        throw new myError(400,result.error);
    }else{
        next();
    }
}

//Post Review Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let data = req.body;
    let newReview = new Review(data);
    let reviewSaved = await newReview.save();
    let listing = await Listing.findById(id);
    listing.reviews.push(reviewSaved);
    await listing.save();
    res.redirect(`/listings/${id}`);
}))

//Delete Route 
router.delete("/:rid",wrapAsync(async(req,res)=>{
    let {id,rid} = req.params;
    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : rid}});
    res.redirect(`/listings/${id}`);
}))

module.exports = router;