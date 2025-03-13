const { ref } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
        default : "https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg",
        set : (value)=> value ==="" ? "https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg" : value,
    },
    price : {
        type : Number,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ]
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;