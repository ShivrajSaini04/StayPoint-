const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../Errors/wrapAsync.js");
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudeConfig.js");
const upload = multer({ storage });

// root route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("image"),
        validateListing,
        wrapAsync(listingController.createListing)
    )

// Add new list route
router.get("/new", isLoggedIn, listingController.newListing);

// listing by id
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// edit listing route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
);

module.exports = router;