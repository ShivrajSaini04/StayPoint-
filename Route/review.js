const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../Errors/wrapAsync.js");
const ExpressError = require("../Errors/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/revews.js");

// review create route

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// review Delete route

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;
