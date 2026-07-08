const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
};

module.exports.newListing = (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    try {
        const listingBody = req.body.listing || {};
        let newList = new Listing(listingBody);
        const response = await axios.get(
            "https://api.geoapify.com/v1/geocode/search",
            {
                params: {
                    text: `${newList.location}, ${newList.country}`,
                    apiKey: process.env.GEOAPIFY_API_KEY,
                },
            }
        );

        if (response.data.features.length > 0) {
            const coordinates =
                response.data.features[0].geometry.coordinates;
            newList.geometry = {
                type: "Point",
                coordinates,
            };
        }
        if (req.file) {
            const url = req.file.path || req.file.url || req.file.secure_url;
            const filename = req.file.filename || req.file.public_id || req.file.originalname;
            newList.image = { url, filename };
        }
        newList.owner = req.user._id;
        await newList.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        const listingBody = { ...req.body.listing };
        if (req.file) {
            listingBody.image = {
                url: req.file.path || req.file.url || req.file.secure_url,
                filename: req.file.filename || req.file.public_id || req.file.originalname,
            };
        }
        await Listing.findByIdAndUpdate(id, listingBody, { new: true });
        req.flash("success", "Update Listing");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted");
    res.redirect(`/listings`);
};
