const User = require("../models/user");
const passport = require("passport");

// signup  form 
module.exports.signupForm = (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.signupUser = async( req,res) => {
    try{
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        const userdata = await User.register(newUser, password);
        req.login(userdata , (err) =>{
            if (err) { return next(err);}
            req.flash("success", "Welcome to StayPoint");
            return res.redirect("/listings"); 
        });
    } catch(err){
       req.flash("error" , err.message);
       res.redirect("/signup");
    }
};

// login page 

module.exports.loginForm = (req, res) => {
    res.render("user/login.ejs");
};

module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome to StayPoint ! login successfully..");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
};

// log out 

module.exports.logoutUser = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    });
};