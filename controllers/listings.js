const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
};

module.exports.newListing = (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    try {
        const listingBody = req.body.listing || {};
        let newList = new Listing(listingBody);
        if (req.file) {
            const url = req.file.path || req.file.url || req.file.secure_url;
            const filename = req.file.filename || req.file.public_id || req.file.originalname;
            newList.image = { url, filename };
        } else if (listingBody.image && listingBody.image.url) {
            newList.image = listingBody.image;
        }
        newList.owner = req.user && req.user._id;
        await newList.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } catch (e) {
        next(e);
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

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let updated = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if (req.file && updated) {
        const url = req.file.path || req.file.url || req.file.secure_url;
        const filename = req.file.filename || req.file.public_id || req.file.originalname;
        updated.image = { url, filename };
        await updated.save();
    }
    req.flash("success", "Update Listing");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted");
    res.redirect(`/listings`);
};
