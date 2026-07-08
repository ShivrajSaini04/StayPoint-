const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { object } = require("joi");

main().then(() => {
    console.log("Database Connected");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/staypoint");
}

const initDB = async () => {
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a3a83a7973cb22d2fb39bf8",
        reviews: [],
        geometry: {
            type: "Point",
            coordinates: [],
        },
    }));

    await Listing.insertMany(initData.data);
    console.log("Data init successfully");
};

initDB();