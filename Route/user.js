const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../Errors/wrapAsync");
const passport = require("passport");
const { saveRedirecturl } = require("../middleware");

const userController = require("../controllers/users.js");

// signup page
router.route("/signup")
.get( userController.signupForm)
.post( saveRedirecturl, wrapAsync(userController.signupUser));

// login page 
router.route("/login")
.get( userController.loginForm)
.post( saveRedirecturl, passport.authenticate("local",
      { failureredirect: "/login", failureFlash: true }), wrapAsync(userController.loginUser));

// log out 

router.get("/logout", userController.logoutUser );


module.exports = router;
