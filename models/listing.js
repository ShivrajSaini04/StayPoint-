const express = require("express");
const { Schema, default: mongoose } = require("mongoose");
const Review = require("./review.js");

const DEFAULT_IMAGE_URL =
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60";

const listingSchema = new Schema({
    title : String,
    description : String,
    image: {
        url: String,
        filename: String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },  
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            default: [],
        },
    },
});

listingSchema.post("findOneAndDelete",async(listing) => {
    if (Listing){
         await Review.deleteMany({_id: {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;
