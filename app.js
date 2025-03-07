const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listings");
const Path = require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");

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
})

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
})))

//Post Route
app.post("/listings",wrapAsync(async (req,res)=>{
        let {title,description,price,image="https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg",country,location} = req.body;
        let newListing = new Listing({title,description,image,price,country,location});
        await newListing.save();
        res.redirect("/listings");
    
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

app.put("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let {title,description,price,country,location} = req.body;
    await Listing.findByIdAndUpdate(id,{title,description,price,country,location});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Custom Error Handler
app.use((err,req,res,next)=>{
    res.send("Something went wrong");
})
