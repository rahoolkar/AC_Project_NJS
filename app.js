const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listings");
const Path = require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const myError = require("./utils/myError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/project');
}

main().then(()=>{
    console.log("connected to the database");
    app.listen(3000,()=>{
        console.log("app is running on port 3000");
    })  
}).catch((error)=>{
    console.log(error);
});

app.use(express.static(Path.join(__dirname,"/public")))
app.engine('ejs', engine);
app.use(methodOverride('_method'))
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.set("view engine","ejs");
app.set("views",Path.join(__dirname,"/views"));

//Index Route
app.get("/listings",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",(wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})));

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

//Post Route
app.post("/listings",validateSchema,wrapAsync(async (req,res)=>{
    let data = req.body;
    let newListing = new Listing(data);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

app.put("/listings/:id",validateSchema,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let data = req.body;
    await Listing.findByIdAndUpdate(id,data);
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Review Route
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
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let data = req.body;
    let newReview = new Review(data);
    let reviewSaved = await newReview.save();
    let listing = await Listing.findById(id);
    listing.reviews.push(reviewSaved);
    await listing.save();
    res.redirect(`/listings/${id}`);
}))

app.all("*",(req,res)=>{
    throw new myError(404,"Page not found");
})

//Custom Error Handler
app.use((err,req,res,next)=>{
    let {status=500 ,message="Out tester are working"} = err;
    res.status(status).render("error.ejs",{message});
});

