const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./Errors/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const wrapAsync = require("./Errors/wrapAsync");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing ");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirecturl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!res.locals.curruser._id.equals(listing.owner._id)) {
        req.flash("error", "you are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
});

// validation  middleware for new listing
module.exports.validateListing = (req, res, next) => {
    if (!req.body.listing) req.body.listing = {};
    if (!req.body.listing.image) req.body.listing.image = {};
    if (req.file) {
        req.body.listing.image.url = req.file.path;
        req.body.listing.image.filename = req.file.filename;
    } else {
        req.body.listing.image.url = req.body.listing.image.url || "";
    }
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// validation  middleware for review
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!res.locals.curruser._id.equals(review.author)) {
        req.flash("error", "you are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
});
