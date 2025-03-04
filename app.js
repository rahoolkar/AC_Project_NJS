const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listings");


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

app.get("/testListing",async (req,res)=>{
    let newListing = new Listing({
        title : "title",
        description : "description",
        price : 7800,
        country : "India",
        location : "Delhi"
    })

    await newListing.save();
    res.send("Listing was saved successfully");
})



