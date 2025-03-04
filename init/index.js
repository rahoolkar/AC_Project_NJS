const mongoose = require("mongoose");
const Listing = require("../models/listings");
const {data} = require("./data");


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/project');
}

main().then(()=>{
    console.log("connected to the database");
}).catch((error)=>{
    console.log(error);
})

async function init(){
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log("data inserted successfully");
}

init();