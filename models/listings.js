const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review.js")

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

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;