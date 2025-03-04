const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listings");
const Path = require("path");


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


app.set("view engine","ejs");
app.set("views",Path.join(__dirname,"/views"));

//Index Route
app.get("/listings",async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});




