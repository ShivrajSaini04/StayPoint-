require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});
console.log(process.env.GEOAPIFY_API_KEY);
const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("../models/listing");

async function main() {
    await mongoose.connect(
        "mongodb://127.0.0.1:27017/staypoint"
    );

    console.log("DB Connected");

    const listings = await Listing.find({
        "geometry.coordinates": { $size: 0 },
    });

    console.log(
        `${listings.length} listings need coordinates`
    );

    for (let listing of listings) {
        try {
            const response = await axios.get(
                "https://api.geoapify.com/v1/geocode/search",
                {
                    params: {
                        text: `${listing.location}, ${listing.country}`,
                        apiKey:
                            process.env.GEOAPIFY_API_KEY,
                    },
                }
            );

            if (
                response.data.features.length > 0
            ) {
                const coordinates =
                    response.data.features[0]
                        .geometry.coordinates;

                listing.geometry = {
                    type: "Point",
                    coordinates,
                };

                await listing.save();

                console.log(
                    `Updated: ${listing.title}`
                );
            } else {
                console.log(
                    `No coordinates found for: ${listing.title}`
                );
            }
        } catch (err) {
                console.log(`Error updating ${listing.title}`);
                // console.log(err);
        }
    }

    mongoose.connection.close();
}

main();