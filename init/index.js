const mongoose = require("mongoose");
const Listing = require("../models/listings");
const { data } = require("./data");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/project");
}

main()
  .then(() => {
    console.log("connected to the database");
  })
  .catch((error) => {
    console.log(error);
  });

async function init() {
  await Listing.deleteMany({});
  let newData = data.map((listing) => {
    return { ...listing, owner: "67d8ab5a86ba39dbd2974f01" };
  });
  await Listing.insertMany(newData);
  console.log("data inserted successfully");
}

init();
